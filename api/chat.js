const knowledge = [
  "Tayyab Sayyad is an MSc AIDS student building an AI/full-stack portfolio focused on practical software, data and AI projects.",
  "Tayyab works with Python, JavaScript, React, PostgreSQL, HTML/CSS, Git, Three.js, LangChain, RAG and OpenAI concepts.",
  "A major project is an academic/university AI chatbot designed to answer questions from university documents using retrieval augmented generation.",
  "Tayyab is interested in AI/ML, full-stack development, data analytics, data science, quantum computing concepts and interactive web experiences.",
  "The portfolio includes a University AI Chatbot, an interactive 3D AI portfolio and student analytics work."
];

function tokenize(text) {
  return new Set(
    text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean)
  );
}

function isPortfolioQuestion(query) {
  const q = query.toLowerCase();
  const personalTerms = [
    "tayyab", "my portfolio", "your portfolio", "his portfolio",
    "your project", "his project", "your skill", "his skill",
    "your education", "his education", "your experience", "his experience",
    "your github", "your linkedin", "your resume", "about you", "about yourself"
  ];
  return personalTerms.some(term => q.includes(term));
}

function retrieve(query) {
  if (!isPortfolioQuestion(query)) return "";

  const q = tokenize(query);
  return knowledge
    .map(text => {
      const words = tokenize(text);
      let score = 0;
      for (const word of q) if (words.has(word)) score++;
      return { text, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(x => x.text)
    .join("\n");
}

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter(item => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string")
    .slice(-10)
    .map(item => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: item.content.slice(0, 6000) }]
    }));
}

function extractSources(data) {
  const chunks = data?.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const seen = new Set();
  return chunks
    .map(chunk => chunk?.web)
    .filter(web => web?.uri)
    .filter(web => {
      if (seen.has(web.uri)) return false;
      seen.add(web.uri);
      return true;
    })
    .slice(0, 6)
    .map(web => ({ title: web.title || "Web source", url: web.uri }));
}

async function callGemini({ apiKey, model, contents, systemPrompt, useWebSearch }) {
  const body = {
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    contents,
    generationConfig: {
      temperature: 0.35
    }
  };

  if (useWebSearch) {
    body.tools = [{ google_search: {} }];
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify(body)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const detail = data?.error?.message || `Gemini API returned HTTP ${response.status}`;
    const error = new Error(detail);
    error.status = response.status;
    throw error;
  }

  return {
    answer:
      data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") ||
      "I couldn't generate a response.",
    sources: extractSources(data)
  };
}

async function askGemini(message, history, context, useWebSearch) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

  const systemPrompt = context
    ? `You are the universal AI assistant embedded in Tayyab Sayyad's portfolio.

You can answer general questions normally. For questions about Tayyab, use the supplied portfolio context as the source of personal facts. Never invent personal facts, contact details, education history, employment, achievements or project metrics.

For all other questions, answer directly using your general knowledge. If web search is enabled, use it when current, recent, changing, or verifiable information would improve the answer.

Portfolio context:
${context}`
    : `You are a universal general-purpose AI assistant embedded in a developer portfolio.

Answer the user's question directly. Do NOT say that the portfolio lacks the answer. Do NOT restrict answers to portfolio information.

You can answer general questions about science, history, geography, education, programming, mathematics, AI/ML, data science, technology, writing and everyday topics. If web search is enabled, use it when current, recent, changing, or verifiable information would improve the answer.

If the user asks about Tayyab personally, only state facts that are present in the portfolio context supplied by the application.`;

  const safeHistory = cleanHistory(history);
  const contents = [...safeHistory, {
    role: "user",
    parts: [{ text: message }]
  }];

  try {
    return await callGemini({ apiKey, model, contents, systemPrompt, useWebSearch });
  } catch (error) {
    // Keep the assistant usable if Google Search is unavailable on the current API tier/model.
    if (useWebSearch) {
      return await callGemini({ apiKey, model, contents, systemPrompt, useWebSearch: false });
    }
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ answer: "Method not allowed", sources: [] });
  }

  const { message, history, useWebSearch = true } = req.body || {};

  if (!message?.trim()) {
    return res.status(400).json({ answer: "Please ask a question.", sources: [] });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      answer: "The AI is not configured. Add GEMINI_API_KEY in Vercel Environment Variables and redeploy.",
      sources: []
    });
  }

  try {
    const context = retrieve(message.trim());
    const result = await askGemini(
      message.trim(),
      history,
      context,
      Boolean(useWebSearch)
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Gemini AI error:", error);
    return res.status(500).json({
      answer: "The AI request failed: " + String(error?.message || error),
      sources: []
    });
  }
}

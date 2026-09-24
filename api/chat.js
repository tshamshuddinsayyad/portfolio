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
    "your github", "your linkedin", "your resume"
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

async function askGemini(message, context) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

  const systemPrompt = context
    ? `You are an AI assistant for Tayyab Sayyad's portfolio.

This is a PERSONAL portfolio question. Use the portfolio context below for facts about Tayyab. Never invent personal facts.

Portfolio context:
${context}

Answer the user's question clearly.`
    : `You are a GENERAL-PURPOSE AI ASSISTANT.

Answer the user's question directly using your general knowledge. Do NOT talk about Tayyab, the portfolio, or portfolio context unless the user asks about them.

You can answer questions about current general facts to the best of your model knowledge, programming, mathematics, science, history, geography, education, writing, technology and everyday topics.

IMPORTANT: An empty portfolio context does NOT mean the user question cannot be answered. Never respond with "the portfolio does not contain that detail" for a general question.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [
          {
            role: "user",
            parts: [{ text: message }]
          }
        ],
        generationConfig: {
          temperature: 0.4
        }
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const detail = data?.error?.message || `Gemini API returned HTTP ${response.status}`;
    throw new Error(detail);
  }

  return data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") ||
    "I couldn't generate a response.";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ answer: "Method not allowed" });
  }

  const { message } = req.body || {};

  if (!message?.trim()) {
    return res.status(400).json({ answer: "Please ask a question." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      answer: "The AI is not configured. Add GEMINI_API_KEY in Vercel Environment Variables and redeploy."
    });
  }

  try {
    const answer = await askGemini(message.trim(), retrieve(message.trim()));
    return res.status(200).json({ answer });
  } catch (error) {
    console.error("Gemini AI error:", error);
    return res.status(500).json({
      answer: "The AI request failed: " + String(error?.message || error)
    });
  }
}

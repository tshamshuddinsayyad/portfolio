const knowledge = [
  "Tayyab Sayyad is an MSc AIDS student building an AI/full-stack portfolio focused on practical software, data and AI projects.",
  "Tayyab works with Python, JavaScript, React, PostgreSQL, HTML/CSS, Git, Three.js, LangChain, RAG and OpenAI concepts.",
  "A major project is an academic/university AI chatbot designed to answer questions from university documents using retrieval augmented generation.",
  "Tayyab is interested in AI/ML, full-stack development, data analytics, data science, quantum computing concepts and interactive web experiences.",
  "The portfolio includes a University AI Chatbot, an interactive 3D AI portfolio and student analytics work."
];

function tokenize(text) {
  return new Set(
    text.toLowerCase().replace(/[^a-z0-9\\s]/g, " ").split(/\\s+/).filter(Boolean)
  );
}

function retrieve(query) {
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
    .join("\\n");
}

async function askGemini(message, context) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

  const systemPrompt =
    "You are the general-purpose AI assistant embedded in Tayyab Sayyad's developer portfolio. " +
    "Answer general questions normally: programming, mathematics, science, writing, study help, explanations, brainstorming and everyday knowledge. " +
    "When a question is about Tayyab, his portfolio, projects, skills, education or experience, use the supplied portfolio context and never invent personal facts. " +
    "If the portfolio context is empty, that does NOT mean you should refuse the question. Answer the user's general question using your general knowledge. " +
    "Only say that the portfolio does not contain a detail when the user specifically asks for a personal detail about Tayyab and that detail is absent. " +
    "For general questions, answer directly and do not force the answer to be about Tayyab. " +
    "For factual questions about well-known people, countries, science, programming, history, mathematics and other general topics, provide the answer directly. " +
    "Do not claim to have live web access or current real-time information unless it is supplied by a tool. " +
    "Keep answers clear, useful and appropriately detailed. " +
    "\\n\\nPortfolio context:\\n" + (context || "No relevant portfolio context.");

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
        ]
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
      answer:
        "The portfolio AI is not configured yet. Add GEMINI_API_KEY in Vercel → Project Settings → Environment Variables, then redeploy."
    });
  }

  try {
    const context = retrieve(message.trim());
    const answer = await askGemini(message.trim(), context);

    return res.status(200).json({ answer });
  } catch (error) {
    console.error("Portfolio Gemini AI error:", error);

    return res.status(500).json({
      answer: "The AI request failed: " + String(error?.message || error)
    });
  }
}

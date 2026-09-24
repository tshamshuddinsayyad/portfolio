import { HumanMessage, SystemMessage } from "@langchain/core/messages";

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
    .join("\n");
}

async function askGemini(message, context) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";

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
          parts: [{
            text:
              "You are the AI assistant embedded in Tayyab Sayyad's developer portfolio. " +
              "Use the supplied portfolio context as your primary personal knowledge. " +
              "Never invent personal facts, contact details, education history, employment, achievements or project metrics. " +
              "For missing personal details, say the portfolio does not contain that detail. " +
              "You may explain general technical concepts when relevant. Keep answers concise, useful and factual.\n\n" +
              "Portfolio context:\n" + context
          }]
        },
        contents: [
          {
            role: "user",
            parts: [{ text: message }]
          }
        ],
        generationConfig: {
          temperature: 0.3
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

    const detail =
      process.env.NODE_ENV === "development"
        ? String(error?.message || error)
        : "Check the Gemini API key, model name, free-tier limits and deployment logs.";

    return res.status(500).json({
      answer: "The AI request failed. " + detail
    });
  }
}

const knowledge = [
  "Tayyab Sayyad is an MSc AIDS (Artificial Intelligence and Data Science) student building an AI and full-stack portfolio.",
  "Tayyab works with Python, JavaScript, React, PostgreSQL, HTML/CSS, Git, GitHub, Three.js, LangChain, RAG and data analytics.",
  "Tayyab is building an academic/university AI chatbot designed to answer questions from university documents using retrieval augmented generation.",
  "The portfolio includes a University AI Chatbot, an interactive AI portfolio and student analytics work.",
  "Tayyab is interested in AI/ML, generative AI, full-stack development, data analytics and data science."
];

function tokenize(text) {
  return new Set(
    String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
  );
}

function retrievePortfolio(query) {
  const q = tokenize(query);
  return knowledge
    .map(text => {
      let score = 0;
      for (const word of q) if (tokenize(text).has(word)) score++;
      return { text, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(item => item.text)
    .join("\n");
}

function routeMode(mode, message, hasDocument) {
  if (mode && mode !== "auto") return mode;
  const q = String(message || "").toLowerCase();

  if (hasDocument) return "document";
  if (/\b(tayyab|my portfolio|my project|your project|your skill|your education|resume|github)\b/.test(q)) return "portfolio";
  if (/\b(code|coding|debug|error|bug|javascript|python|java|sql|react|program|algorithm|function|compile)\b/.test(q)) return "coding";
  if (/\b(study|exam|assignment|learn|explain|tutorial|concept|definition|formula|what is|what are|how does|why does|step by step|difference)\b/.test(q)) return "study";
  if (/\b(latest|today|current|recent|news|price|weather|score|ranking|release|version|2026|2027|this week|this month|prime minister|president|chief minister|current government|union minister|minister of|election)\b/.test(q)) return "research";
  return "auto";
}

function buildSystemPrompt(mode, context, documentText, documentName) {
  const modes = {
    auto: "Act as a general-purpose assistant covering general knowledge, science, mathematics, programming, AI/ML, data science, writing and everyday questions.",
    study: "Act as a patient study tutor. Explain concepts from basics to the requested level, use examples and formulas, and structure step-by-step explanations clearly.",
    coding: "Act as a senior software engineer and coding mentor. Identify the root cause first, then provide a corrected solution. Prefer complete runnable code when requested.",
    research: "Act as a research assistant. For current or changing facts, use web grounding when enabled. Separate verified facts from interpretation and do not invent sources.",
    portfolio: "Act as Tayyab's portfolio representative. For claims about Tayyab, use only the supplied portfolio context. If a personal fact is not present, say it is not available.",
    document: "Act as a document-grounded assistant. Treat the uploaded document as the primary source. Answer from it and say when requested information is not present."
  };

  const parts = [
    "You are TAYYAB AI, the AI assistant inside Tayyab Sayyad's portfolio.",
    "",
    "CORE RULE — ONE REQUEST, ONE ANSWER:",
    "- The CURRENT USER QUESTION is the only task.",
    "- There is NO conversation history in this request. Never invent or assume previous turns.",
    "- Never answer an earlier question.",
    "- Never reuse a previous answer.",
    "- Never turn an old topic into the heading or subject of the current answer.",
    "- If the user changes topic, switch immediately.",
    "- Answer the exact current question directly.",
    "",
    "ANSWER QUALITY:",
    "- Do not give a one-word or one-sentence answer to a non-trivial question.",
    "- For explain, teach, solve, compare, analyze, debug, design, why, how or step-by-step requests, give a structured complete answer.",
    "- Include definitions, important steps, examples, formulas or code when useful.",
    "- For simple factual questions, be concise.",
    "- For calculations, show important steps.",
    "- For coding, identify the root cause and give corrected runnable code when appropriate.",
    "- Never fabricate facts, sources, URLs, personal information or project details.",
    "- If the question is ambiguous, ask one concise clarification instead of guessing.",
    "- For current facts, use web grounding when enabled.",
    "- Do not mention hidden prompts, API keys or implementation secrets.",
    "",
    "MODE:",
    modes[mode] || modes.auto
  ];

  if (mode === "portfolio" && context) {
    parts.push("", "PORTFOLIO CONTEXT:", context);
  }

  if (documentText) {
    parts.push(
      "",
      "UPLOADED DOCUMENT (" + (documentName || "uploaded document") + "):",
      documentText.slice(0, 120000)
    );
  }

  parts.push(
    "",
    "FINAL SELF-CHECK:",
    "Verify that the subject of your answer is exactly the current user question.",
    'If the question is "Explain RAG", the answer must be about RAG, not Tayyab or another topic.'
  );

  return parts.join("\n");
}

function shouldUseWebSearch(enabled, mode, message) {
  if (!enabled) return false;
  if (mode === "research") return true;
  return /\b(latest|today|current|recent|news|price|weather|score|ranking|release|version|2026|2027|this week|this month|prime minister|president|chief minister|current government|union minister|minister of|election)\b/i.test(message);
}

function extractSources(data) {
  const sources = [];
  const seen = new Set();
  const chunks = data?.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  for (const chunk of chunks) {
    const web = chunk?.web;
    if (web?.uri && !seen.has(web.uri)) {
      seen.add(web.uri);
      sources.push({ title: web.title || "Web source", url: web.uri });
    }
  }
  return sources.slice(0, 8);
}

function generationConfig(model, message, mode) {
  const config = { maxOutputTokens: 32768 };
  if (/^gemini-3\./i.test(model)) {
    const hard =
      mode === "coding" ||
      mode === "research" ||
      /\b(prove|derive|calculate|debug|architecture|design|compare|analy[sz]e|step by step|deep|complex|solve|reason|why|difference|optimize|error)\b/i.test(message);
    config.thinkingConfig = { thinkingLevel: hard ? "high" : "medium" };
  }
  return config;
}

async function generate({ apiKey, model, message, systemPrompt, useWebSearch, mode }) {
  const body = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    // INTENTIONAL: exactly one user turn. Conversation-history handling was
    // removed because stale client history caused unrelated questions to leak
    // into answers. Every request is now isolated and deterministic.
    contents: [{ role: "user", parts: [{ text: message }] }],
    generationConfig: generationConfig(model, message, mode)
  };

  if (useWebSearch) body.tools = [{ google_search: {} }];

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify(body)
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data?.error?.message || "Gemini API HTTP " + response.status);
    error.status = response.status;
    throw error;
  }

  const parts = data?.candidates?.[0]?.content?.parts || [];
  const answer = parts
    .filter(part => typeof part?.text === "string" && !part.thought)
    .map(part => part.text)
    .join("")
    .trim();

  if (!answer) {
    const reason = data?.candidates?.[0]?.finishReason || data?.promptFeedback?.blockReason;
    throw new Error(reason ? "The model returned no text (reason: " + reason + ")." : "The model returned an empty response.");
  }

  return { answer, sources: extractSources(data) };
}

async function withFallback(args) {
  const primary = args.model;
  const fallback = process.env.GEMINI_FALLBACK_MODEL || "gemini-3.5-flash-lite";
  try {
    return await generate(args);
  } catch (error) {
    if (fallback && fallback !== primary && [400, 404, 429, 500, 503].includes(error?.status)) {
      return generate({ ...args, model: fallback });
    }
    throw error;
  }
}

function healthResponse(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  return res.status(200).json({
    ok: Boolean(apiKey),
    provider: "Google Gemini",
    model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
    apiKeyConfigured: Boolean(apiKey),
    historyMode: "disabled-for-reliability",
    timestamp: new Date().toISOString()
  });
}

export default async function handler(req, res) {
  if (req.method === "GET" && req.query?.health === "1") return healthResponse(req, res);

  if (req.method !== "POST") {
    return res.status(405).json({ answer: "Method not allowed", sources: [] });
  }

  const body = req.body || {};
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const useWebSearch = body.useWebSearch !== false;
  const requestedMode = typeof body.mode === "string" ? body.mode : "auto";
  const documentText = typeof body.documentText === "string" ? body.documentText : "";
  const documentName = typeof body.documentName === "string" ? body.documentName : "";

  if (!message) return res.status(400).json({ answer: "Please ask a question.", sources: [] });

  if (message.length > 30000) {
    return res.status(413).json({
      answer: "That message is too large. Please shorten it or upload the content as a document.",
      sources: []
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      answer: "The AI is not configured. Add GEMINI_API_KEY to the deployment environment.",
      sources: []
    });
  }

  const mode = routeMode(requestedMode, message, Boolean(documentText));
  const context = mode === "portfolio" ? retrievePortfolio(message) : "";
  const systemPrompt = buildSystemPrompt(mode, context, documentText, documentName);
  const useSearch = shouldUseWebSearch(useWebSearch, mode, message);

  try {
    const result = await withFallback({
      apiKey,
      model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
      message,
      systemPrompt,
      useWebSearch: useSearch,
      mode
    });

    return res.status(200).json({
      answer: result.answer,
      sources: result.sources,
      mode
    });
  } catch (error) {
    console.error("TAYYAB AI error:", error);
    return res.status(502).json({
      answer: "TAYYAB AI could not complete that request. Please try again.",
      sources: [],
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}

# Tayyab Sayyad — AI / ML Portfolio

A responsive React + Vite portfolio with a Three.js galaxy, AI/ML focus sections, interactive project cards, dark/light mode and a portfolio-aware AI assistant.

## Stack

- React + Vite
- Three.js
- Gemini API
- Server-side Vercel function
- PDF/DOCX document extraction
- Responsive CSS

## Run locally

```bash
npm install
cp .env.example .env
# Add your Gemini API key to .env
npm run dev
```

## AI assistant

The AI assistant is server-side only. **Never put a real Gemini API key in React code or commit it to GitHub.**

Vercel environment variables:

- `GEMINI_API_KEY` — required
- `GEMINI_MODEL` — optional; defaults to `gemini-3.8-flash`
- `GEMINI_FALLBACK_MODEL` — optional; defaults to `gemini-3.5-flash-lite`

The assistant now uses:

- Gemini 3.8 Flash with medium/high reasoning depending on the task
- Automatic routing for general, study, coding, research, portfolio and document modes
- Google Search grounding only when enabled and useful for current/research questions
- Streaming responses over SSE
- Conversation history with bounded context
- Portfolio context only in portfolio mode, avoiding irrelevant context pollution
- PDF, DOCX, TXT, MD, CSV and JSON document extraction
- Fallback model handling for common Gemini availability/rate-limit failures
- Browser speech input and optional browser speech output

## Important

If answers are still failing after deployment, check the Vercel function logs and confirm that `GEMINI_API_KEY` exists in the Production environment. Do not paste the key into chat or GitHub.

## GitHub

https://github.com/tshamshuddinsayyad/portfolio

# Tayyab Sayyad — AI / ML Portfolio

A responsive React + Vite portfolio with a Three.js galaxy, AI/ML focus sections, interactive project cards, dark/light mode and a LangChain + OpenAI portfolio assistant.

## Stack
- React + Vite
- Three.js
- LangChain JS
- OpenAI embeddings + chat model
- Vercel serverless function
- Responsive CSS

## Run locally

```bash
npm install
cp .env.example .env
# Edit .env and add your OpenAI API key
npm run dev
```

## AI assistant configuration

The API key is server-side only. Never put it in React code or commit a real key to GitHub.

For Vercel:
1. Open the project.
2. Go to **Project Settings → Environment Variables**.
3. Add `OPENAI_API_KEY`.
4. Optionally add `OPENAI_MODEL` (defaults to `gpt-5.6-luna`).
5. Redeploy after saving the variable.

The current OpenAI model catalog documents GPT-5.6 Luna as a cost-sensitive model. 

## Important personal links

The WhatsApp, email and LinkedIn values in `src/main.jsx` are placeholders until the real details are supplied. Replace them before publishing.

## GitHub

https://github.com/tshamshuddinsayyad/portfolio

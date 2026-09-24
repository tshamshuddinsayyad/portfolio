# Tayyab Sayyad — AI Portfolio

A production-oriented React + Vite portfolio with a Three.js background and a LangChain-powered personal AI assistant.

## Stack
- React + Vite
- Three.js
- LangChain JS
- OpenAI embeddings + chat model
- Vercel serverless function
- Responsive CSS

## Run locally
npm install
npm run dev

## AI assistant
Copy .env.example to .env and add your OpenAI API key:

OPENAI_API_KEY=...

The API key must never be placed in React client code.

## Personal details to update
Edit the `profile` object in `src/main.jsx` and replace the placeholder WhatsApp, email and LinkedIn values.

## Deploy
Vercel supports Vite/React deployments and Git-based continuous deployment. Import this GitHub repository into Vercel, add OPENAI_API_KEY under Project Settings → Environment Variables, and deploy.

GitHub: https://github.com/tshamshuddinsayyad/portfolio

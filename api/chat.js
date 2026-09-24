import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const knowledge = [
  "Tayyab Sayyad is an MSc AIDS student building an AI/full-stack portfolio focused on practical software, data and AI projects.",
  "Tayyab works with Python, JavaScript, React, PostgreSQL, HTML/CSS, Git, Three.js, LangChain, RAG and OpenAI concepts.",
  "A major project is an academic/university AI chatbot designed to answer questions from university documents using retrieval augmented generation.",
  "Tayyab is interested in AI/ML, full-stack development, data analytics, data science, quantum computing concepts and interactive web experiences.",
  "The portfolio includes a University AI Chatbot, an interactive 3D AI portfolio and student analytics work."
];

let embeddingCache = null;
function dot(a,b){let s=0,aa=0,bb=0;for(let i=0;i<a.length;i++){s+=a[i]*b[i];aa+=a[i]*a[i];bb+=b[i]*b[i]}return s/(Math.sqrt(aa)*Math.sqrt(bb)||1)}

async function retrieve(query){
  const embeddings=new OpenAIEmbeddings({model:"text-embedding-3-small"});
  if(!embeddingCache){
    embeddingCache=await Promise.all(knowledge.map(async text=>({text,vector:await embeddings.embedQuery(text)})));
  }
  const q=await embeddings.embedQuery(query);
  return embeddingCache.map(x=>({text:x.text,score:dot(q,x.vector)})).sort((a,b)=>b.score-a.score).slice(0,3).map(x=>x.text).join("\n");
}

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({answer:"Method not allowed"});
  const {message}=req.body||{};
  if(!message?.trim()) return res.status(400).json({answer:"Please ask a question."});

  if(!process.env.OPENAI_API_KEY){
    return res.status(503).json({answer:"The portfolio AI is not configured on this deployment yet. Add OPENAI_API_KEY in Vercel → Project Settings → Environment Variables, then redeploy."});
  }

  try{
    const context=await retrieve(message);
    const model=new ChatOpenAI({
      apiKey:process.env.OPENAI_API_KEY,
      model:process.env.OPENAI_MODEL || "gpt-5.6-luna",
      temperature:0.3
    });
    const out=await model.invoke([
      new SystemMessage(
        "You are the AI assistant embedded in Tayyab Sayyad's developer portfolio. " +
        "Use the supplied portfolio context as your primary personal knowledge. Never invent personal facts, contact details, education history, employment, achievements or project metrics. " +
        "For missing personal details, say the portfolio does not contain that detail. " +
        "You may explain general technical concepts when relevant. Keep answers concise, useful and factual.\n\nPortfolio context:\n"+context
      ),
      new HumanMessage(message.trim())
    ]);
    return res.status(200).json({answer:typeof out.content==="string"?out.content:JSON.stringify(out.content)});
  }catch(error){
    console.error("Portfolio AI error:",error);
    const detail=process.env.NODE_ENV==="development" ? String(error?.message||error) : "Check the API key, model name and deployment logs.";
    return res.status(500).json({answer:"The AI request failed. "+detail});
  }
}
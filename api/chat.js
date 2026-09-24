import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const knowledge = [
  "Tayyab Sayyad is an MSc AIDS student and is building an AI/full-stack portfolio focused on practical software, data and AI projects.",
  "Tayyab has worked with Python, JavaScript, React, PostgreSQL, HTML/CSS, Git, Three.js, LangChain and RAG concepts.",
  "A major project is an academic/university AI chatbot designed to answer questions from university documents using retrieval augmented generation.",
  "Tayyab is interested in full-stack development, AI applications, data analytics and building portfolio projects that demonstrate practical engineering ability.",
  "The portfolio includes a University AI Chatbot, an interactive 3D AI portfolio and student analytics work."
];

function dot(a,b){let s=0,aa=0,bb=0;for(let i=0;i<a.length;i++){s+=a[i]*b[i];aa+=a[i]*a[i];bb+=b[i]*b[i]}return s/(Math.sqrt(aa)*Math.sqrt(bb)||1)}

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({answer:"Method not allowed"});
  const {message}=req.body||{};
  if(!message) return res.status(400).json({answer:"Please ask a question."});
  if(!process.env.OPENAI_API_KEY) return res.status(200).json({answer:"Demo mode is active. Add OPENAI_API_KEY in Vercel Environment Variables to enable the LangChain AI assistant."});
  try{
    const embeddings=new OpenAIEmbeddings({model:"text-embedding-3-small"});
    const q=await embeddings.embedQuery(message);
    const docs=await Promise.all(knowledge.map(async text=>({text,score:dot(q,await embeddings.embedQuery(text))})));
    const context=docs.sort((a,b)=>b.score-a.score).slice(0,3).map(x=>x.text).join("\n");
    const model=new ChatOpenAI({model:"gpt-5.6-luna",temperature:0.3});
    const out=await model.invoke([
      new SystemMessage("You are Tayyab Sayyad's portfolio assistant. Answer only from the supplied portfolio context. If the context does not contain the answer, say that the portfolio does not provide that detail. Be concise, friendly and factual. Context:\n"+context),
      new HumanMessage(message)
    ]);
    return res.status(200).json({answer:out.content});
  }catch(error){
    console.error(error);
    return res.status(500).json({answer:"The AI service encountered an error. Please try again later."});
  }
}

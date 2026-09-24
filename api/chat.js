import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const knowledge = [
  "Tayyab Sayyad is an MSc AIDS student building an AI/full-stack portfolio focused on practical software, data and AI projects.",
  "Tayyab works with Python, JavaScript, React, PostgreSQL, HTML/CSS, Git, Three.js, LangChain and RAG concepts.",
  "A major project is an academic/university AI chatbot designed to answer questions from university documents using retrieval augmented generation.",
  "Tayyab is interested in AI/ML, full-stack development, data analytics, data science, quantum computing concepts and interactive web experiences.",
  "The portfolio includes a University AI Chatbot, an interactive 3D AI portfolio and student analytics work."
];

function dot(a,b){let s=0,aa=0,bb=0;for(let i=0;i<a.length;i++){s+=a[i]*b[i];aa+=a[i]*a[i];bb+=b[i]*b[i]}return s/(Math.sqrt(aa)*Math.sqrt(bb)||1)}

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({answer:"Method not allowed"});
  const {message}=req.body||{};
  if(!message) return res.status(400).json({answer:"Please ask a question."});
  if(!process.env.OPENAI_API_KEY) return res.status(200).json({answer:"AI demo mode is active. Add OPENAI_API_KEY to the deployment environment to enable the OpenAI-powered LangChain assistant."});

  try{
    const embeddings=new OpenAIEmbeddings({model:"text-embedding-3-small"});
    const q=await embeddings.embedQuery(message);
    const docs=await Promise.all(knowledge.map(async text=>({text,score:dot(q,await embeddings.embedQuery(text))})));
    const context=docs.sort((a,b)=>b.score-a.score).slice(0,3).map(x=>x.text).join("\n");

    const model=new ChatOpenAI({
      model:process.env.OPENAI_MODEL || "gpt-5.6-luna",
      temperature:0.3
    });

    const out=await model.invoke([
      new SystemMessage(
        "You are the AI assistant embedded in Tayyab Sayyad's developer portfolio. " +
        "Use the supplied portfolio context as your primary knowledge. Answer questions about the portfolio, " +
        "projects, skills and technical interests. For questions outside the context, clearly say that the portfolio " +
        "does not contain that specific personal detail rather than inventing facts. You can still explain general " +
        "technical concepts when the user asks about AI, ML, data science, LangChain, RAG, Three.js or quantum computing. " +
        "Be concise, useful and factual.\n\nPortfolio context:\n"+context
      ),
      new HumanMessage(message)
    ]);

    return res.status(200).json({answer:typeof out.content==="string"?out.content:JSON.stringify(out.content)});
  }catch(error){
    console.error("Portfolio AI error:",error);
    return res.status(500).json({answer:"The AI service is temporarily unavailable. Check the OpenAI API key/model configuration in the deployment environment."});
  }
}

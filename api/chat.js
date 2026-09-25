const knowledge = [
  "Tayyab Sayyad is an MSc AIDS student building an AI/full-stack portfolio focused on practical software, data and AI projects.",
  "Tayyab works with Python, JavaScript, React, PostgreSQL, HTML/CSS, Git, Three.js, LangChain, RAG, OpenAI concepts and data analytics.",
  "A major project is an academic/university AI chatbot designed to answer questions from university documents using retrieval augmented generation.",
  "The portfolio includes a University AI Chatbot, an interactive 3D AI portfolio and student analytics work.",
  "Tayyab is interested in AI/ML, full-stack development, data analytics, data science and interactive web experiences."
];

function tokenize(text) {
  return new Set(String(text || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean));
}

function retrieve(query) {
  const q = tokenize(query);
  return knowledge.map(text => {
    const words = tokenize(text);
    let score = 0;
    for (const word of q) if (words.has(word)) score++;
    return {text,score};
  }).sort((a,b)=>b.score-a.score).slice(0,4).map(x=>x.text).join("\n");
}

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history.filter(x=>x && (x.role==="user" || x.role==="assistant") && typeof x.content==="string")
    .slice(-12).map(x=>({role:x.role==="assistant"?"model":"user",parts:[{text:x.content.slice(0,7000)}]}));
}

function extractSources(data, existing=[]) {
  const seen = new Set(existing.map(x=>x.url));
  const chunks = data?.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  for (const chunk of chunks) {
    const web = chunk?.web;
    if (web?.uri && !seen.has(web.uri)) {
      seen.add(web.uri);
      existing.push({title:web.title || "Web source",url:web.uri});
    }
  }
  return existing.slice(0,8);
}

function routeMode(mode,message,hasDocument) {
  if (mode && mode !== "auto") return mode;
  const q=message.toLowerCase();
  if (hasDocument) return "document";
  if (/(tayyab|my portfolio|my project|your project|your skill|your education|resume|github)/.test(q)) return "portfolio";
  if (/(code|debug|error|bug|javascript|python|java|sql|react|program)/.test(q)) return "coding";
  if (/(study|exam|assignment|learn|explain|tutorial|concept)/.test(q)) return "study";
  if (/(latest|today|current|recent|news|price|2026|research)/.test(q)) return "research";
  return "auto";
}

function buildSystemPrompt(mode,context,documentText,documentName) {
  const common = `You are TAYYAB AI, the personal AI assistant inside Tayyab Sayyad's portfolio.
Be accurate, useful and concise. Do not invent personal facts, credentials, project metrics, contact details or experiences.
Use Markdown when useful. For code, provide runnable code and explain important parts. When the user asks for current information and web search is available, use it and cite sources through the provided source list.
`;
  const modes = {
    auto: "Act as a versatile general assistant. Handle general knowledge, science, mathematics, programming, AI/ML, data science, writing and everyday questions.",
    study: "Act as a study tutor. Explain step-by-step, use examples, formulas and short checks for understanding. Prefer exam-ready structure when appropriate.",
    coding: "Act as a senior coding mentor. Diagnose errors, explain root causes, provide corrected runnable code and mention edge cases and security concerns when relevant.",
    research: "Act as a research assistant. Prefer current verifiable information, distinguish facts from analysis, and use web grounding when enabled.",
    portfolio: "Act as Tayyab's portfolio representative. Answer questions about Tayyab only from the supplied portfolio context. Never guess missing personal details.",
    document: `Act as a document-grounded assistant. Answer from the uploaded document first. If the answer is not present, clearly say that it is not in the document instead of inventing it. Document: ${documentName || "uploaded document"}.`
  };
  return common + "\nMODE: " + (modes[mode] || modes.auto) +
    (context ? "\n\nPORTFOLIO CONTEXT:\n"+context : "") +
    (documentText ? "\n\nUPLOADED DOCUMENT:\n"+documentText.slice(0,120000) : "");
}

async function callGemini({apiKey,model,contents,systemPrompt,useWebSearch}) {
  const body={systemInstruction:{parts:[{text:systemPrompt}]},contents,generationConfig:{temperature:.35}};
  if(useWebSearch) body.tools=[{google_search:{}}];
  const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{
    method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":apiKey},body:JSON.stringify(body)
  });
  const data=await response.json();
  if(!response.ok) throw Object.assign(new Error(data?.error?.message || `Gemini API HTTP ${response.status}`),{status:response.status});
  return {answer:data?.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("")||"I couldn't generate a response.",sources:extractSources(data)};
}

async function streamGemini({apiKey,model,contents,systemPrompt,useWebSearch,res}) {
  const body={systemInstruction:{parts:[{text:systemPrompt}]},contents,generationConfig:{temperature:.35}};
  if(useWebSearch) body.tools=[{google_search:{}}];
  const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`,{
    method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":apiKey},body:JSON.stringify(body)
  });
  if(!response.ok){
    const data=await response.json().catch(()=>({}));
    throw new Error(data?.error?.message || `Gemini stream HTTP ${response.status}`);
  }
  const reader=response.body.getReader();
  const decoder=new TextDecoder();
  let buffer="",sources=[];
  const send=(obj)=>res.write("data: "+JSON.stringify(obj)+"\n\n");
  while(true){
    const {value,done}=await reader.read();
    buffer+=decoder.decode(value||new Uint8Array(),{stream:!done});
    const events=buffer.split("\n\n"); buffer=events.pop()||"";
    for(const event of events){
      const line=event.split("\n").find(x=>x.startsWith("data:"));
      if(!line) continue;
      try{
        const data=JSON.parse(line.slice(5).trim());
        const text=data?.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("")||"";
        if(text) send({type:"text",text});
        sources=extractSources(data,sources);
      }catch{}
    }
    if(done) break;
  }
  if(buffer.trim()){
    const line=buffer.split("\n").find(x=>x.startsWith("data:"));
    if(line) try{
      const data=JSON.parse(line.slice(5).trim());
      const text=data?.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("")||"";
      if(text) send({type:"text",text});
      sources=extractSources(data,sources);
    }catch{}
  }
  send({type:"sources",sources});
  send({type:"done"});
  res.end();
}

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({answer:"Method not allowed",sources:[]});
  const {message,history,useWebSearch=true,mode="auto",documentText="",documentName=""}=req.body||{};
  if(!message?.trim()) return res.status(400).json({answer:"Please ask a question.",sources:[]});
  const apiKey=process.env.GEMINI_API_KEY;
  const model=process.env.GEMINI_MODEL||"gemini-3.5-flash-lite";
  if(!apiKey) return res.status(503).json({answer:"The AI is not configured. Add GEMINI_API_KEY in Vercel Environment Variables and redeploy.",sources:[]});

  const selectedMode=routeMode(mode,message,Boolean(documentText));
  const context=retrieve(message.trim());
  const systemPrompt=buildSystemPrompt(selectedMode,context,documentText,documentName);
  const contents=[...cleanHistory(history),{role:"user",parts:[{text:message.trim()}]}];

  if(req.headers.accept?.includes("text/event-stream")){
    res.setHeader("Content-Type","text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control","no-cache, no-transform");
    res.setHeader("Connection","keep-alive");
    res.setHeader("X-Accel-Buffering","no");
    try{
      await streamGemini({apiKey,model,contents,systemPrompt,useWebSearch:Boolean(useWebSearch),res});
      return;
    }catch(error){
      if(useWebSearch){
        try{
          await streamGemini({apiKey,model,contents,systemPrompt,useWebSearch:false,res});
          return;
        }catch(fallbackError){ error=fallbackError; }
      }
      try{res.write("data: "+JSON.stringify({type:"error",message:error.message||"AI request failed"})+"\n\n");res.end();}catch{}
      return;
    }
  }

  try{
    const result=await callGemini({apiKey,model,contents,systemPrompt,useWebSearch:Boolean(useWebSearch)});
    return res.status(200).json(result);
  }catch(error){
    if(useWebSearch){
      try{
        const result=await callGemini({apiKey,model,contents,systemPrompt,useWebSearch:false});
        return res.status(200).json(result);
      }catch{}
    }
    return res.status(500).json({answer:"The AI request failed: "+String(error?.message||error),sources:[]});
  }
}

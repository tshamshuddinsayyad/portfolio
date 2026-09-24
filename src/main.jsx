import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import * as THREE from "three";
import { ArrowUpRight, Bot, Github, Linkedin, Mail, MessageCircle, Send, Sparkles, Download, ExternalLink } from "lucide-react";
import "./styles.css";

const profile = {
  name: "Tayyab Sayyad",
  role: "AI • Full Stack Developer",
  tagline: "I build intelligent digital experiences that feel fast, useful and human.",
  github: "https://github.com/tshamshuddinsayyad",
  linkedin: "https://www.linkedin.com/",
  whatsapp: "https://wa.me/919999999999",
  email: "your-email@example.com"
};

const projects = [
  { title: "University AI Chatbot", text: "Academic assistant using LangChain/RAG concepts to answer questions from university documents.", tags: ["LangChain", "RAG", "AI"] },
  { title: "3D AI Portfolio", text: "Interactive developer portfolio with WebGL motion, project exploration and an AI profile assistant.", tags: ["React", "Three.js", "Vite"] },
  { title: "Student Analytics", text: "Data-focused student analytics work using Python, Pandas and visual reporting.", tags: ["Python", "Pandas", "Analytics"] }
];

const skills = ["Python", "JavaScript", "React", "LangChain", "RAG", "PostgreSQL", "HTML/CSS", "Git", "Three.js", "Data Analytics"];

function Space() {
  const ref = useRef(null);
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
    camera.position.z = 8;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    ref.current.appendChild(renderer.domElement);
    const geometry = new THREE.BufferGeometry();
    const count = 900;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 28;
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0x9ab8ff, size: 0.025, transparent: true, opacity: 0.75 });
    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.2, 0.008, 8, 160),
      new THREE.MeshBasicMaterial({ color: 0x5ee7df, transparent: true, opacity: 0.45 })
    );
    ring.rotation.x = Math.PI / 2.4;
    scene.add(ring);
    let frame;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      stars.rotation.y += 0.00035;
      stars.rotation.x += 0.00012;
      ring.rotation.z += 0.001;
      renderer.render(scene, camera);
    };
    animate();
    const resize = () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); };
    addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); removeEventListener("resize", resize); renderer.dispose(); geometry.dispose(); material.dispose(); ref.current?.removeChild(renderer.domElement); };
  }, []);
  return <div className="space" ref={ref} />;
}

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hi! I’m Tayyab’s portfolio assistant. Ask me about his skills, projects, learning path or experience." }]);

  async function send() {
    const q = input.trim();
    if (!q || busy) return;
    setMessages(m => [...m, { role: "user", content: q }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: q }) });
      const data = await res.json();
      setMessages(m => [...m, { role: "assistant", content: data.answer || "I couldn't answer that right now." }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "The AI service is not configured yet. Add OPENAI_API_KEY in your deployment environment to enable the LangChain assistant." }]);
    } finally { setBusy(false); }
  }

  return <>
    <button className="chat-fab" onClick={() => setOpen(v => !v)} aria-label="Open AI assistant"><Bot size={22}/><span>Ask AI</span></button>
    {open && <section className="chat-panel">
      <div className="chat-head"><div><b>Portfolio AI</b><small>LangChain • RAG assistant</small></div><Sparkles size={18}/></div>
      <div className="chat-body">{messages.map((m,i) => <div key={i} className={"bubble " + m.role}>{m.content}</div>)}{busy && <div className="bubble assistant">Thinking…</div>}</div>
      <div className="chat-input"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask about Tayyab…" /><button onClick={send}><Send size={18}/></button></div>
    </section>}
  </>;
}

function App() {
  return <div className="app">
    <Space />
    <nav className="nav"><a className="brand" href="#">TS<span>.</span></a><div className="navlinks"><a href="#about">About</a><a href="#work">Work</a><a href="#skills">Skills</a><a href="#contact">Contact</a></div><a className="nav-cta" href={profile.github} target="_blank" rel="noreferrer"><Github size={16}/> GitHub</a></nav>
    <main>
      <section className="hero" id="about">
        <div className="eyebrow"><span className="dot"/> Available for opportunities</div>
        <h1>Building <em>intelligent</em><br/>digital experiences.</h1>
        <p>{profile.tagline}</p>
        <div className="hero-actions"><a className="primary" href="#work">Explore my work <ArrowUpRight size={18}/></a><a className="secondary" href={profile.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={18}/> WhatsApp</a></div>
        <div className="hero-stats"><div><strong>AI</strong><span>RAG & agents</span></div><div><strong>WEB</strong><span>Full-stack apps</span></div><div><strong>DATA</strong><span>Analytics</span></div></div>
      </section>

      <section className="section" id="work"><div className="section-kicker">01 / Selected work</div><h2>Projects with a purpose.</h2><div className="project-grid">{projects.map((p,i)=><article className="project" key={p.title}><div className="project-num">0{i+1}</div><h3>{p.title}</h3><p>{p.text}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div><a href={profile.github} target="_blank" rel="noreferrer">View on GitHub <ArrowUpRight size={15}/></a></article>)}</div></section>

      <section className="section split" id="skills"><div><div className="section-kicker">02 / Toolkit</div><h2>Curious by default.</h2><p className="muted">A growing toolkit across software engineering, AI, data and interactive web experiences.</p></div><div className="skill-cloud">{skills.map(s=><span key={s}>{s}</span>)}</div></section>

      <section className="section contact" id="contact"><div className="section-kicker">03 / Let’s connect</div><h2>Have an idea worth building?</h2><p>Open to conversations about projects, internships, freelance work and AI-powered products.</p><div className="contact-actions"><a className="primary" href={profile.whatsapp} target="_blank" rel="noreferrer"><MessageCircle/> WhatsApp</a><a className="secondary" href={"mailto:"+profile.email}><Mail/> Email me</a><a className="secondary" href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin/> LinkedIn</a></div></section>
    </main>
    <footer><span>© {new Date().getFullYear()} {profile.name}</span><span>Designed + built with React, Three.js & AI</span></footer>
    <Chatbot />
  </div>;
}
createRoot(document.getElementById("root")).render(<App />);

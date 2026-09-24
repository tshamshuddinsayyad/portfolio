import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import * as THREE from "three";
import {
  ArrowUpRight, Bot, Github, Linkedin, Mail, MessageCircle, Send,
  Sparkles, Sun, Moon, BrainCircuit, Database, Atom, Code2,
  MousePointer2, ExternalLink
} from "lucide-react";
import "./styles.css";

const profile = {
  name: "Tayyab Sayyad",
  role: "AI / ML • Full Stack Developer",
  tagline: "I build intelligent digital systems that turn ideas into useful experiences.",
  github: "https://github.com/tshamshuddinsayyad",
  linkedin: "https://www.linkedin.com/",
  whatsapp: "https://wa.me/919999999999",
  email: "your-email@example.com"
};

const projects = [
  { title: "University AI Chatbot", text: "A document-aware academic assistant using LangChain, RAG and LLMs to answer university questions from trusted documents.", tags: ["LangChain", "RAG", "LLM"], icon: BrainCircuit },
  { title: "Interactive AI Portfolio", text: "A personal product-style portfolio combining React, Three.js, motion and a portfolio-aware universal AI assistant.", tags: ["React", "Three.js", "Vite"], icon: Atom },
  { title: "Student Analytics", text: "Python-based analytics and visualization work focused on student datasets, descriptive statistics and data-driven insights.", tags: ["Python", "Pandas", "Data"], icon: Database }
];

const skillGroups = [
  { title: "Build", items: ["Python", "JavaScript", "React", "HTML", "CSS", "SQL"] },
  { title: "Think", items: ["AI / ML", "LangChain", "RAG", "OpenAI", "Data Analytics", "Statistics"] },
  { title: "Ship", items: ["Git", "GitHub", "PostgreSQL", "Three.js", "APIs", "Vite"] }
];

function InteractiveField({ dark }) {
  const ref = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 100);
    camera.position.set(0, 0, 13);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const count = 1150;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * 15;
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 2] = -2 - Math.random() * 18;
      sizes[i] = 0.02 + Math.random() * 0.035;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    const points = new THREE.Points(geometry, new THREE.PointsMaterial({
      color: dark ? 0xa7e9ff : 0x397b91,
      size: dark ? 0.035 : 0.045,
      transparent: true,
      opacity: dark ? 0.48 : 0.25,
      sizeAttenuation: true
    }));
    group.add(points);

    const core = new THREE.Group();
    core.position.set(0, 0.2, -3.5);
    scene.add(core);

    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.35, 2),
      new THREE.MeshBasicMaterial({
        color: dark ? 0x70f1dc : 0x087f86,
        wireframe: true,
        transparent: true,
        opacity: dark ? 0.34 : 0.22
      })
    );
    core.add(shell);

    const inner = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 24, 24),
      new THREE.MeshBasicMaterial({
        color: dark ? 0xffffff : 0x0c5262,
        transparent: true,
        opacity: dark ? 0.82 : 0.5
      })
    );
    core.add(inner);

    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.75, 0.012, 8, 160),
      new THREE.MeshBasicMaterial({ color: dark ? 0x54a9ff : 0x1677c8, transparent: true, opacity: 0.35 })
    );
    ring1.rotation.x = Math.PI / 2.4;
    core.add(ring1);

    const ring2 = ring1.clone();
    ring2.rotation.y = Math.PI / 2.2;
    ring2.scale.setScalar(0.78);
    core.add(ring2);

    const mouseMove = e => {
      pointer.current.x = (e.clientX / innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / innerHeight - 0.5) * 2;
    };
    addEventListener("pointermove", mouseMove);

    let frame;
    const animate = time => {
      frame = requestAnimationFrame(animate);
      const t = time * 0.001;
      camera.position.x += (pointer.current.x * 0.65 - camera.position.x) * 0.025;
      camera.position.y += (-pointer.current.y * 0.38 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, -3);

      points.rotation.y = t * 0.006;
      points.position.x = Math.sin(t * 0.08) * 0.18;
      core.rotation.y = t * 0.24 + pointer.current.x * 0.18;
      core.rotation.x = Math.sin(t * 0.5) * 0.08 + pointer.current.y * 0.08;
      shell.rotation.z = t * 0.17;
      ring1.rotation.z = t * 0.25;
      ring2.rotation.x = t * -0.2;
      inner.scale.setScalar(1 + Math.sin(t * 2.2) * 0.06);
      renderer.render(scene, camera);
    };
    animate(0);

    const resize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    };
    addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("pointermove", mouseMove);
      removeEventListener("resize", resize);
      geometry.dispose();
      points.material.dispose();
      core.traverse(o => { o.geometry?.dispose(); o.material?.dispose(); });
      renderer.dispose();
      if (host.contains(renderer.domElement)) host.removeChild(renderer.domElement);
    };
  }, [dark]);

  return <div className="field" ref={ref} />;
}

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [webSearch, setWebSearch] = useState(true);
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Hi! I’m Tayyab’s AI assistant. Ask me about Tayyab, his projects, coding, AI/ML, study topics, or current information."
  }]);

  const prompts = [
    "Who is Tayyab?",
    "What AI projects has he built?",
    "Explain RAG simply",
    "Write a Python Fibonacci program"
  ];

  async function send(text = input) {
    const q = text.trim();
    if (!q || busy) return;
    const history = messages.slice(-8).map(m => ({ role: m.role, content: m.content }));
    setMessages(m => [...m, { role: "user", content: q }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, history, useWebSearch: webSearch })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.answer || "Request failed");
      setMessages(m => [...m, { role: "assistant", content: data.answer || "I couldn't answer that.", sources: data.sources || [] }]);
    } catch (e) {
      setMessages(m => [...m, { role: "assistant", content: e.message || "The AI service is unavailable." }]);
    } finally {
      setBusy(false);
    }
  }

  return <>
    <button className="chat-fab" onClick={() => setOpen(v => !v)}><Bot size={18}/><span>Ask my AI</span><i/></button>
    {open && <section className="chat-panel">
      <div className="chat-head">
        <div><b><Sparkles size={14}/> TAYYAB AI</b><small>Ask the portfolio anything</small></div>
        <div className="chat-head-actions"><button className={webSearch ? "search-toggle active" : "search-toggle"} onClick={() => setWebSearch(v => !v)}>{webSearch ? "WEB ON" : "WEB OFF"}</button><button onClick={() => setOpen(false)}>×</button></div>
      </div>
      <div className="quick-prompts">{prompts.map(p => <button key={p} onClick={() => send(p)}>{p}</button>)}</div>
      <div className="chat-body">
        {messages.map((m,i) => <div key={i} className={"chat-message " + m.role}><div className={"bubble " + m.role}>{m.content}</div>{m.sources?.length > 0 && <div className="sources"><span>Sources</span>{m.sources.map((s,j)=><a key={s.url+j} href={s.url} target="_blank" rel="noreferrer">{j+1}. {s.title}</a>)}</div>}</div>)}
        {busy && <div className="bubble assistant typing">Thinking<span>•••</span></div>}
      </div>
      <div className="chat-input"><input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask anything…"/><button onClick={() => send()} disabled={busy}><Send size={16}/></button></div>
    </section>}
  </>;
}

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") !== "light");
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return <div className="app">
    <InteractiveField dark={dark}/>
    <header className="nav">
      <a className="brand" href="#"><span className="brand-mark">T</span><span>SAYYAD</span></a>
      <div className="navlinks"><a href="#about">About</a><a href="#work">Work</a><a href="#skills">Skills</a><a href="#contact">Contact</a></div>
      <div className="nav-right"><button className="theme-toggle" onClick={() => setDark(v => !v)}>{dark ? <Sun size={15}/> : <Moon size={15}/>}<span>{dark ? "Light" : "Dark"}</span></button><a className="nav-cta" href={profile.github} target="_blank" rel="noreferrer"><Github size={15}/> GitHub</a></div>
    </header>

    <main>
      <section className="hero" id="about">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot"/> AI / ML / FULL STACK / DATA</div>
          <h1>I build <em>intelligent</em><br/>digital systems.</h1>
          <p>{profile.tagline} Explore my work, interact with my AI assistant, and see how I turn ideas into working products.</p>
          <div className="hero-actions"><a className="primary" href="#work">Explore my work <ArrowUpRight size={17}/></a><a className="secondary" href="#contact">Let's connect <MessageCircle size={17}/></a></div>
          <div className="scroll-hint"><MousePointer2 size={14}/> Move your cursor across the page</div>
        </div>
        <div className="hero-object">
          <div className="object-label"><span>INTERACTIVE CORE</span><i>LIVE</i></div>
          <div className="object-copy"><Sparkles size={16}/><span>THINK</span><b>BUILD</b><span>EXPLORE</span></div>
        </div>
      </section>

      <section className="section intro">
        <div className="section-label">01 — THINK</div>
        <div className="intro-grid">
          <h2>Ideas are easy.<br/><em>Building them is the craft.</em></h2>
          <div><p>I’m a developer focused on practical AI, data and full-stack systems. I like turning complex ideas into interfaces people can actually use.</p><div className="mini-stats"><div><b>AI / ML</b><span>Intelligent systems</span></div><div><b>DATA</b><span>Analytics & statistics</span></div><div><b>WEB</b><span>Modern products</span></div></div></div>
        </div>
      </section>

      <section className="section work" id="work">
        <div className="section-label">02 — BUILD</div>
        <div className="section-heading"><h2>Selected <em>missions.</em></h2><span>Hover a project</span></div>
        <div className="project-grid">{projects.map((p,i) => { const Icon=p.icon; return <article className="project-card" key={p.title}>
          <div className="project-number">0{i+1}</div><div className="project-icon"><Icon size={22}/></div><span className="project-type">CASE STUDY / 0{i+1}</span>
          <h3>{p.title}</h3><p>{p.text}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>
          <a href={profile.github} target="_blank" rel="noreferrer">View on GitHub <ExternalLink size={14}/></a>
          <div className="project-hover"><span>BUILD</span><b>→</b></div>
        </article>})}</div>
      </section>

      <section className="section systems">
        <div className="section-label">03 — EXPLORE</div>
        <h2>A toolkit for <em>building intelligence.</em></h2>
        <div className="skill-grid">{skillGroups.map(g => <div className="skill-group" key={g.title}><span className="group-title">{g.title}</span>{g.items.map((s,i)=><div className="skill-row" key={s}><small>0{i+1}</small><b>{s}</b><span>↗</span></div>)}</div>)}</div>
      </section>

      <section className="section language-section" id="skills">
        <div className="section-label">04 — FLUENCY</div>
        <div className="language-layout"><div><h2>Code is a <em>language.</em></h2><p>From Python and SQL to JavaScript and React, I use technology as a medium for solving problems.</p></div><div className="language-bars">{[["Python","AI • Data • Automation","92%"],["JavaScript","Web • React • UI","84%"],["SQL","Database • Analytics","78%"],["C / Java","Core programming","65%"]].map(x=><div className="language-bar" key={x[0]}><div><b>{x[0]}</b><span>{x[1]}</span><i>{x[2]}</i></div><u><span style={{width:x[2]}}/></u></div>)}</div></div>
      </section>

      <section className="section learning">
        <div className="section-label">05 — KEEP LEARNING</div>
        <div className="learning-grid"><div><h2>Always <em>evolving.</em></h2><p>Currently exploring AI engineering, LLM applications, data science and emerging computing.</p></div><div className="learning-cards"><article><Atom/><b>AI & ML</b><span>LLMs, RAG and intelligent systems</span></article><article><Database/><b>Data Science</b><span>Statistics, Python and analytics</span></article><article><Code2/><b>Full Stack</b><span>React, APIs and databases</span></article></div></div>
      </section>

      <section className="section contact" id="contact">
        <div className="contact-box"><div className="section-label">06 — CONNECT</div><h2>Have an idea?<br/><em>Let's build it.</em></h2><p>AI, data, web development or an interesting experiment — I'm always open to meaningful projects and conversations.</p><div className="contact-actions"><a className="primary" href={profile.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17}/> WhatsApp</a><a className="secondary" href={"mailto:"+profile.email}><Mail size={17}/> Email</a><a className="secondary" href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17}/> LinkedIn</a></div></div>
      </section>
    </main>

    <footer><span>© {new Date().getFullYear()} {profile.name}</span><span>THINK • BUILD • EXPLORE</span></footer>
    <Chatbot/>
  </div>;
}

createRoot(document.getElementById("root")).render(<App />);

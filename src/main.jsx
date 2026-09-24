import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import * as THREE from "three";
import { ArrowUpRight, Bot, Github, Linkedin, Mail, MessageCircle, Send, Sparkles, Sun, Moon, BrainCircuit, Database, Atom, Code2 } from "lucide-react";
import "./styles.css";

const profile = {
  name: "Tayyab Sayyad",
  role: "AI / ML • Full Stack Developer",
  tagline: "I build intelligent products across AI, data, web engineering and interactive experiences.",
  github: "https://github.com/tshamshuddinsayyad",
  linkedin: "https://www.linkedin.com/",
  whatsapp: "https://wa.me/919999999999",
  email: "your-email@example.com"
};

const projects = [
  { title: "University AI Chatbot", text: "A document-aware academic assistant using LangChain and retrieval-augmented generation for university questions.", tags: ["LangChain", "RAG", "OpenAI"] },
  { title: "3D AI Portfolio", text: "An immersive personal portfolio combining React, Three.js, interactive motion and a portfolio-aware AI assistant.", tags: ["React", "Three.js", "Vite"] },
  { title: "Student Analytics", text: "Data analysis and visual reporting work built around student datasets, statistics and Python tooling.", tags: ["Python", "Pandas", "Data"] }
];

const skills = ["Python", "JavaScript", "React", "LangChain", "RAG", "OpenAI", "PostgreSQL", "HTML/CSS", "Git", "Three.js", "Pandas", "Data Analytics"];

function Space() {
  const ref = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 1000);
    camera.position.z = 10;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    ref.current?.appendChild(renderer.domElement);

    const galaxy = new THREE.Group();
    const count = 5200, positions = new Float32Array(count * 3);
    const arms = 5, radius = 16;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3, r = Math.pow(Math.random(), 0.58) * radius;
      const arm = i % arms, spin = (arm / arms) * Math.PI * 2 + r * 0.72;
      const spread = (Math.random() - 0.5) * (0.55 + r * 0.055);
      positions[i3] = Math.cos(spin) * r + spread;
      positions[i3 + 1] = (Math.random() - 0.5) * (0.45 + r * 0.035);
      positions[i3 + 2] = Math.sin(spin) * r + spread;
    }
    const galaxyGeometry = new THREE.BufferGeometry();
    galaxyGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const galaxyMaterial = new THREE.PointsMaterial({ color: 0x9ec5ff, size: 0.045, transparent: true, opacity: 0.78, blending: THREE.AdditiveBlending, depthWrite: false });
    const galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
    galaxy.rotation.x = 0.35; galaxy.add(galaxyPoints); scene.add(galaxy);

    const objects = [];
    const makeOrb = (geometry, color, scale, position) => {
      const group = new THREE.Group();
      const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.3 }));
      const glow = new THREE.Mesh(geometry.clone(), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.045, blending: THREE.AdditiveBlending }));
      glow.scale.setScalar(1.45); group.add(mesh, glow); group.position.set(...position); group.scale.setScalar(scale); scene.add(group);
      objects.push({ group, mesh, speed: 0.002 + Math.random() * 0.003, phase: Math.random() * 6.28 });
    };
    makeOrb(new THREE.IcosahedronGeometry(1, 1), 0x5ee7df, 1.15, [-5.2, 1.7, -1]);
    makeOrb(new THREE.OctahedronGeometry(1.1, 1), 0x9b8cff, 0.9, [5.1, -1.1, -1.5]);
    makeOrb(new THREE.TorusKnotGeometry(0.75, 0.18, 80, 12), 0x76a8ff, 0.72, [3.2, 2.8, -2.5]);
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.75, 2), new THREE.MeshBasicMaterial({ color: 0x5ee7df, wireframe: true, transparent: true, opacity: 0.32 }));
    scene.add(core);

    const mouseMove = e => { pointer.current.x = (e.clientX / innerWidth - 0.5) * 2; pointer.current.y = (e.clientY / innerHeight - 0.5) * 2; };
    addEventListener("pointermove", mouseMove);
    let frame;
    const animate = time => {
      frame = requestAnimationFrame(animate); const t = time * 0.001;
      camera.position.x += (pointer.current.x * 0.8 - camera.position.x) * 0.025;
      camera.position.y += (-pointer.current.y * 0.5 - camera.position.y) * 0.025; camera.lookAt(0, 0, 0);
      galaxy.rotation.y += 0.0011; galaxy.rotation.z = Math.sin(t * 0.08) * 0.08;
      core.rotation.x += 0.003; core.rotation.y += 0.004; core.scale.setScalar(1 + Math.sin(t * 2.2) * 0.08);
      objects.forEach(({ group, mesh, speed, phase }) => {
        mesh.rotation.x += speed; mesh.rotation.y += speed * 1.25; group.rotation.z = Math.sin(t + phase) * 0.22;
        group.position.x += ((group.userData.baseX + pointer.current.x * 0.38) - group.position.x) * 0.012;
        group.position.y += ((group.userData.baseY - pointer.current.y * 0.28) - group.position.y) * 0.012;
      });
      renderer.render(scene, camera);
    };
    objects.forEach(({ group }) => { group.userData.baseX = group.position.x; group.userData.baseY = group.position.y; });
    animate(0);
    const resize = () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); };
    addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame); removeEventListener("resize", resize); removeEventListener("pointermove", mouseMove); renderer.dispose();
      galaxyGeometry.dispose(); galaxyMaterial.dispose(); objects.forEach(({ group }) => group.traverse(c => { c.geometry?.dispose(); c.material?.dispose(); }));
      core.geometry.dispose(); core.material.dispose(); ref.current?.contains(renderer.domElement) && ref.current.removeChild(renderer.domElement);
    };
  }, []);
  return <div className="space" ref={ref} />;
}

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [webSearch, setWebSearch] = useState(true);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I’m Tayyab’s Universal AI Assistant. Ask me anything — current information, coding, AI/ML, science, study questions, or questions about Tayyab’s portfolio."
    }
  ]);

  const prompts = [
    "Who is the Prime Minister of India?",
    "Explain machine learning simply",
    "Write a Python program for Fibonacci",
    "What projects has Tayyab built?"
  ];

  async function send(text = input) {
    const q = text.trim();
    if (!q || busy) return;

    const history = messages.slice(-8).map(m => ({
      role: m.role,
      content: m.content
    }));

    setMessages(m => [...m, { role: "user", content: q }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q,
          history,
          useWebSearch: webSearch
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.answer || "Request failed");

      setMessages(m => [
        ...m,
        {
          role: "assistant",
          content: data.answer || "I couldn't answer that right now.",
          sources: data.sources || []
        }
      ]);
    } catch (error) {
      setMessages(m => [
        ...m,
        {
          role: "assistant",
          content: error.message || "The AI service is unavailable. Check the deployment environment."
        }
      ]);
    } finally {
      setBusy(false);
    }
  }

  function clearChat() {
    setMessages([{
      role: "assistant",
      content: "New conversation started. Ask me anything."
    }]);
  }

  return <>
    <button className="chat-fab" onClick={() => setOpen(v => !v)} aria-label="Open AI assistant">
      <Bot size={21}/><span>Ask AI</span><i/>
    </button>

    {open && <section className="chat-panel">
      <div className="chat-head">
        <div>
          <b><Sparkles size={15}/> Universal AI Assistant</b>
          <small>General AI • Web • Portfolio Knowledge</small>
        </div>
        <div className="chat-head-actions">
          <button className={webSearch ? "search-toggle active" : "search-toggle"} onClick={() => setWebSearch(v => !v)} title="Toggle web search">
            {webSearch ? "WEB ON" : "WEB OFF"}
          </button>
          <button onClick={clearChat} title="New chat">↻</button>
          <button onClick={() => setOpen(false)} title="Close">×</button>
        </div>
      </div>

      <div className="quick-prompts">
        {prompts.map(p => <button key={p} onClick={() => send(p)}>{p}</button>)}
      </div>

      <div className="chat-body">
        {messages.map((m, i) => <div key={i} className={"chat-message " + m.role}>
          <div className={"bubble " + m.role}>{m.content}</div>
          {m.sources?.length > 0 && <div className="sources">
            <span>Sources</span>
            {m.sources.map((source, index) =>
              <a key={source.url + index} href={source.url} target="_blank" rel="noreferrer">
                {index + 1}. {source.title}
              </a>
            )}
          </div>}
        </div>)}
        {busy && <div className="bubble assistant typing">Thinking<span>•••</span></div>}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask anything…"
        />
        <button onClick={() => send()} disabled={busy}><Send size={17}/></button>
      </div>
    </section>}
  </>;
}

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") !== "light");
  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; localStorage.setItem("theme", dark ? "dark" : "light"); }, [dark]);
  return <div className="app">
    <Space />
    <nav className="nav"><a className="brand" href="#">TS<span>.</span></a><div className="navlinks"><a href="#about">About</a><a href="#focus">Focus</a><a href="#work">Work</a><a href="#skills">Skills</a><a href="#contact">Contact</a></div><div className="nav-right"><button className="theme-toggle" onClick={() => setDark(v=>!v)}>{dark ? <Sun size={16}/> : <Moon size={16}/>}<span>{dark ? "Light" : "Dark"}</span></button><a className="nav-cta" href={profile.github} target="_blank" rel="noreferrer"><Github size={16}/> GitHub</a></div></nav>
    <main>
      <section className="hero" id="about"><div className="hero-grid"><div><div className="eyebrow"><span className="dot"/> AI • ML • DATA • WEB</div><h1>Building <em>intelligent</em><br/>digital experiences.</h1><p>{profile.tagline}</p><div className="hero-actions"><a className="primary" href="#work">Explore work <ArrowUpRight size={18}/></a><a className="secondary" href="#contact">Let’s connect <MessageCircle size={18}/></a></div><div className="hero-stats"><div><strong>AI</strong><span>RAG & assistants</span></div><div><strong>WEB</strong><span>React & 3D</span></div><div><strong>DATA</strong><span>Python & analytics</span></div></div></div><div className="hero-orbit"><div className="orbit-ring ring-a"/><div className="orbit-ring ring-b"/><div className="orbit-core"><BrainCircuit size={46}/><span>AI</span></div><span className="orbit-label l1">RAG</span><span className="orbit-label l2">ML</span><span className="orbit-label l3">DATA</span></div></div></section>

      <section className="section focus" id="focus"><div className="section-kicker">01 / What I build</div><h2>Where code meets intelligence.</h2><div className="focus-grid"><article><BrainCircuit/><b>AI / ML</b><p>AI assistants, retrieval systems, prompt-driven workflows and practical machine learning.</p></article><article><Database/><b>Data</b><p>Python, analytics, structured data and visual insights for real-world problems.</p></article><article><Atom/><b>Emerging Tech</b><p>Interactive experiments around 3D web experiences and quantum-computing concepts.</p></article><article><Code2/><b>Full Stack</b><p>Responsive interfaces and application experiences built with modern JavaScript tooling.</p></article></div></section>

      <section className="section" id="work"><div className="section-kicker">02 / Selected work</div><h2>Projects with a purpose.</h2><div className="project-grid">{projects.map((p,i)=><article className="project" key={p.title}><div className="project-top"><span className="project-num">0{i+1}</span><span className="project-status">BUILDING</span></div><h3>{p.title}</h3><p>{p.text}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div><a href={profile.github} target="_blank" rel="noreferrer">View GitHub <ArrowUpRight size={15}/></a></article>)}</div></section>

      <section className="section split" id="skills"><div><div className="section-kicker">03 / Toolkit</div><h2>Curious by default.</h2><p className="muted">A growing toolkit across software engineering, AI, data and interactive web experiences.</p></div><div className="skill-cloud">{skills.map(s=><span key={s}>{s}</span>)}</div></section>

      <section className="section contact" id="contact"><div className="section-kicker">04 / Let’s connect</div><h2>Have an idea worth building?</h2><p>Explore the work, start a conversation, or ask the portfolio AI about the technology behind it.</p><div className="contact-actions"><a className="primary" href={profile.whatsapp} target="_blank" rel="noreferrer"><MessageCircle/> WhatsApp</a><a className="secondary" href={"mailto:"+profile.email}><Mail/> Email</a><a className="secondary" href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin/> LinkedIn</a></div></section>
    </main>
    <footer><span>© {new Date().getFullYear()} {profile.name}</span><span>React • Three.js • LangChain • OpenAI</span></footer>
    <Chatbot />
  </div>;
}
createRoot(document.getElementById("root")).render(<App />);
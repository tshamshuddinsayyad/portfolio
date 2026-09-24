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

function Space({ dark }) {
  const ref = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 13);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
    renderer.setSize(innerWidth, innerHeight);
    ref.current?.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const palette = dark
      ? { primary: 0x62f6df, secondary: 0x8c7cff, accent: 0x55a8ff, particle: 0x8fb8ff }
      : { primary: 0x087f86, secondary: 0x7054d8, accent: 0x1677c8, particle: 0x5f82a7 };

    // Neural/data field
    const particleCount = dark ? 2600 : 1900;
    const positions = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 5 + Math.random() * 15;
      const angle = Math.random() * Math.PI * 2;
      positions[i3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 3;
      positions[i3 + 1] = (Math.random() - 0.5) * 9;
      positions[i3 + 2] = Math.sin(angle) * radius - 5;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: palette.particle,
      size: dark ? 0.035 : 0.045,
      transparent: true,
      opacity: dark ? 0.58 : 0.34,
      depthWrite: false
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);

    // Quantum probability rings
    const quantum = new THREE.Group();
    [2.1, 2.7, 3.35].forEach((radius, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.012, 8, 120),
        new THREE.MeshBasicMaterial({
          color: index % 2 ? palette.secondary : palette.primary,
          transparent: true,
          opacity: dark ? 0.38 : 0.22
        })
      );
      ring.rotation.set(index * 0.55, index * 0.8, index * 0.35);
      quantum.add(ring);
    });
    group.add(quantum);

    // Central AI quantum core
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.35, 2),
      new THREE.MeshBasicMaterial({
        color: palette.primary,
        wireframe: true,
        transparent: true,
        opacity: dark ? 0.72 : 0.48
      })
    );
    group.add(core);

    const coreGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 24, 24),
      new THREE.MeshBasicMaterial({
        color: palette.accent,
        transparent: true,
        opacity: dark ? 0.08 : 0.05,
        blending: THREE.AdditiveBlending
      })
    );
    group.add(coreGlow);

    // Robotics-inspired orbiting modules
    const modules = [];
    const moduleGeometry = new THREE.OctahedronGeometry(0.48, 1);
    [[-4.8, 1.7, -1], [4.9, -1.5, -2], [3.8, 2.7, -3]].forEach((position, index) => {
      const mesh = new THREE.Mesh(
        moduleGeometry.clone(),
        new THREE.MeshBasicMaterial({
          color: index === 1 ? palette.secondary : palette.accent,
          wireframe: true,
          transparent: true,
          opacity: dark ? 0.42 : 0.3
        })
      );
      mesh.position.set(...position);
      group.add(mesh);
      modules.push({ mesh, base: [...position], phase: index * 2.1 });
    });

    // Data-science grid
    const grid = new THREE.GridHelper(34, 34, palette.primary, palette.primary);
    grid.material.transparent = true;
    grid.material.opacity = dark ? 0.055 : 0.075;
    grid.position.y = -4.8;
    grid.rotation.x = 0;
    scene.add(grid);

    const mouseMove = e => {
      pointer.current.x = (e.clientX / innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / innerHeight - 0.5) * 2;
    };
    addEventListener("pointermove", mouseMove);

    let frame;
    const animate = time => {
      frame = requestAnimationFrame(animate);
      const t = time * 0.001;

      camera.position.x += (pointer.current.x * 1.05 - camera.position.x) * 0.018;
      camera.position.y += (-pointer.current.y * 0.65 - camera.position.y) * 0.018;
      camera.lookAt(0, 0, -2);

      quantum.rotation.x += 0.0022;
      quantum.rotation.y += 0.0032;
      core.rotation.x += 0.0035;
      core.rotation.y += 0.0045;
      core.scale.setScalar(1 + Math.sin(t * 2.2) * 0.07);
      coreGlow.scale.setScalar(1.05 + Math.sin(t * 1.8) * 0.13);
      particles.rotation.y += dark ? 0.00045 : -0.0003;

      modules.forEach(({ mesh, base, phase }) => {
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.007;
        mesh.position.x = base[0] + Math.sin(t * 0.7 + phase) * 0.35;
        mesh.position.y = base[1] + Math.cos(t * 0.8 + phase) * 0.3;
      });

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
      removeEventListener("resize", resize);
      removeEventListener("pointermove", mouseMove);
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      moduleGeometry.dispose();
      quantum.traverse(o => { o.geometry?.dispose(); o.material?.dispose(); });
      core.geometry.dispose();
      core.material.dispose();
      coreGlow.geometry.dispose();
      coreGlow.material.dispose();
      grid.geometry.dispose();
      grid.material.dispose();
      ref.current?.contains(renderer.domElement) && ref.current.removeChild(renderer.domElement);
    };
  }, [dark]);

  return <div className={dark ? "space space-dark" : "space space-light"} ref={ref} />;
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

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return <div className="app">
    <Space dark={dark} />

    <nav className="nav">
      <a className="brand" href="#"><span className="brand-mark">TS</span><span className="brand-dot">.</span></a>
      <div className="navlinks">
        <a href="#about">About</a><a href="#domains">Domains</a><a href="#work">Work</a><a href="#skills">Stack</a><a href="#contact">Contact</a>
      </div>
      <div className="nav-right">
        <button className="theme-toggle" onClick={() => setDark(v => !v)}>
          {dark ? <Sun size={16}/> : <Moon size={16}/>}<span>{dark ? "LIGHT LAB" : "DARK LAB"}</span>
        </button>
        <a className="nav-cta" href={profile.github} target="_blank" rel="noreferrer"><Github size={16}/> GitHub</a>
      </div>
    </nav>

    <main>
      <section className="hero" id="about">
        <div className="hero-copy">
          <div className="eyebrow"><span className="signal"/> AI RESEARCH LAB • 2026</div>
          <div className="hero-badge"><Bot size={14}/> HUMAN + MACHINE + DATA</div>
          <h1>Engineering the<br/><em>intelligence layer.</em></h1>
          <p>{profile.tagline} From retrieval systems and analytics to robotics concepts and quantum computing interfaces.</p>
          <div className="hero-actions">
            <a className="primary" href="#work">Explore systems <ArrowUpRight size={18}/></a>
            <a className="secondary" href="#contact">Connect <MessageCircle size={18}/></a>
          </div>
          <div className="hero-metrics">
            <div><strong>01</strong><span>AI / ML</span></div>
            <div><strong>02</strong><span>DATA SCIENCE</span></div>
            <div><strong>03</strong><span>ROBOTICS</span></div>
            <div><strong>04</strong><span>QUANTUM</span></div>
          </div>
        </div>

        <div className="hero-console">
          <div className="console-top"><span>NEURAL CORE</span><i>ONLINE</i></div>
          <div className="core-visual"><div className="core-ring r1"/><div className="core-ring r2"/><div className="core-ring r3"/><div className="core-center"><BrainCircuit size={40}/><b>AI</b></div></div>
          <div className="console-data"><span>MODEL <b>RAG / LLM</b></span><span>DATA <b>STRUCTURED</b></span><span>STATE <b>LEARNING</b></span></div>
        </div>
      </section>

      <section className="section domains" id="domains">
        <div className="section-kicker">01 / INTELLIGENCE DOMAINS</div>
        <h2>Four systems.<br/><em>One engineering mindset.</em></h2>
        <div className="domain-grid">
          <article><span className="domain-index">AI_01</span><BrainCircuit/><h3>Artificial Intelligence</h3><p>AI assistants, RAG pipelines, LLM workflows and intelligent interfaces designed around useful outcomes.</p><div className="domain-line"/></article>
          <article><span className="domain-index">DATA_02</span><Database/><h3>Data Science</h3><p>Python analytics, statistics, datasets and visual reasoning that turn raw information into decisions.</p><div className="domain-line"/></article>
          <article><span className="domain-index">ROBOT_03</span><Bot/><h3>Robotics</h3><p>Exploring autonomous systems, robot intelligence, sensors, control concepts and human-machine interaction.</p><div className="domain-line"/></article>
          <article><span className="domain-index">QBIT_04</span><Atom/><h3>Quantum Computing</h3><p>Learning quantum concepts, qubits, superposition, circuits and the future intersection of quantum + AI.</p><div className="domain-line"/></article>
        </div>
      </section>

      <section className="section systems" id="work">
        <div className="section-kicker">02 / SYSTEMS IN DEVELOPMENT</div>
        <h2>Built to <em>think, retrieve and respond.</em></h2>
        <div className="project-grid">
          {projects.map((p, i) => <article className="project" key={p.title}>
            <div className="project-top"><span className="project-num">SYS_0{i + 1}</span><span className="project-status"><i/> ACTIVE</span></div>
            <div className="project-icon">{i === 0 ? <BrainCircuit/> : i === 1 ? <Atom/> : <Database/>}</div>
            <h3>{p.title}</h3><p>{p.text}</p>
            <div className="tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
            <a href={profile.github} target="_blank" rel="noreferrer">Inspect system <ArrowUpRight size={15}/></a>
          </article>)}
        </div>
      </section>

      <section className="section stack-section" id="skills">
        <div className="section-kicker">03 / ENGINEERING STACK</div>
        <div className="stack-layout">
          <div><h2>Tools for the<br/><em>intelligence layer.</em></h2><p className="muted">A growing stack across software engineering, AI, data, 3D web experiences and emerging technologies.</p></div>
          <div className="skill-cloud">{skills.map((s, i) => <span key={s}><b>{String(i + 1).padStart(2, "0")}</b>{s}</span>)}</div>
        </div>
      </section>

      <section className="section contact" id="contact">
        <div className="contact-terminal">
          <div className="terminal-head"><span>CONTACT_PROTOCOL</span><span>READY</span></div>
          <div className="terminal-body">
            <span className="prompt">&gt; </span><h2>Have a system<br/>worth building?</h2>
            <p>Let's collaborate on AI, data science, full-stack products, robotics concepts or emerging quantum technology.</p>
            <div className="contact-actions">
              <a className="primary" href={profile.whatsapp} target="_blank" rel="noreferrer"><MessageCircle/> WhatsApp</a>
              <a className="secondary" href={"mailto:" + profile.email}><Mail/> Email</a>
              <a className="secondary" href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin/> LinkedIn</a>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer><span>© {new Date().getFullYear()} {profile.name}</span><span>AI • DATA • ROBOTICS • QUANTUM</span></footer>
    <Chatbot />
  </div>;
}

createRoot(document.getElementById("root")).render(<App />);
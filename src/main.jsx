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
  const mount = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const host = mount.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
    renderer.setSize(innerWidth, innerHeight);
    host.appendChild(renderer.domElement);

    const count = 3000;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const arms = 5;

    for (let i = 0; i < count; i++) {
      const arm = i % arms;
      const radius = Math.pow(Math.random(), 0.60) * 6.4;
      const armAngle = (arm / arms) * Math.PI * 2;
      const angle = armAngle + radius * 1.5 + (Math.random() - 0.5) * 0.62;
      const spread = 0.14 + radius * 0.04;

      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * (0.9 + radius * 0.18);
      positions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * spread;

      const center = Math.max(0, 1 - radius / 5.4);
      sizes[i] = 0.045 + Math.random() * 0.095 + center * 0.04;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(dark ? 0x75b9ff : 0x526fd1) },
        uAccent: { value: new THREE.Color(dark ? 0xc7b7ff : 0x8d7ff0) }
      },
      vertexShader: `
        attribute float size;
        uniform float uTime;
        varying float vCenter;

        void main() {
          vec3 p = position;
          float radius = length(p.xz);
          float speed = 0.018 + 0.014 * (1.0 - min(radius / 5.4, 1.0));
          float a = uTime * speed;
          float cs = cos(a);
          float sn = sin(a);
          p.xz = mat2(cs, -sn, sn, cs) * p.xz;

          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = size * (115.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
          vCenter = 1.0 - smoothstep(0.0, 5.4, radius);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uAccent;
        varying float vCenter;

        void main() {
          float d = length(gl_PointCoord - 0.5);
          float soft = 1.0 - smoothstep(0.05, 0.5, d);
          if (soft < 0.015) discard;
          vec3 color = mix(uColor, uAccent, vCenter * 0.8);
          gl_FragColor = vec4(color, soft * (0.34 + vCenter * 0.60));
        }
      `
    });

    const galaxy = new THREE.Points(geometry, material);
    scene.add(galaxy);

    const onMove = e => {
      pointer.current.x = (e.clientX / innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / innerHeight - 0.5) * 2;
    };
    const onResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    };

    addEventListener("pointermove", onMove);
    addEventListener("resize", onResize);

    let frame;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      material.uniforms.uTime.value = t;

      galaxy.rotation.y += (pointer.current.x * 0.20 - galaxy.rotation.y) * 0.018;
      galaxy.rotation.x += (-pointer.current.y * 0.12 - galaxy.rotation.x) * 0.018;
      galaxy.position.x += (pointer.current.x * 0.32 - galaxy.position.x) * 0.018;
      galaxy.position.y += (-pointer.current.y * 0.20 - galaxy.position.y) * 0.018;

      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("pointermove", onMove);
      removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, [dark]);

  return <div className="field" ref={mount} aria-hidden="true" />;
}

function usePointerGlow() {
  useEffect(() => {
    const onMove = e => {
      const target = e.target.closest?.(".project-card, .skill-group, .learning-cards article, .contact-box, .language-bar, .mini-stats > div");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--glow-x", ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + "%");
      target.style.setProperty("--glow-y", ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + "%");
    };
    document.addEventListener("pointermove", onMove);
    return () => document.removeEventListener("pointermove", onMove);
  }, []);
}

function AILab() {
  const ref = useRef(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    const move = e => {
      const r = host.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      host.style.setProperty("--mx", x.toFixed(3));
      host.style.setProperty("--my", y.toFixed(3));
    };
    const leave = () => {
      host.style.setProperty("--mx", "0");
      host.style.setProperty("--my", "0");
    };

    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div className="ai-lab" ref={ref}>
      <div className="lab-top"><span>AI / DATA SCIENCE LAB</span><i>MODEL ONLINE</i></div>
      <div className="lab-grid" />
      <div className="float-3d item-python"><b>PY</b><span>PYTHON</span></div>
      <div className="float-3d item-data"><Database size={15}/><span>DATA</span></div>
      <div className="float-3d item-rag"><BrainCircuit size={15}/><span>RAG</span></div>
      <div className="float-3d item-sql"><b>SQL</b><span>QUERY</span></div>
      <div className="model-card">
        <div className="model-head"><div><small>ACTIVE MODEL</small><b>INTELLIGENCE ENGINE</b></div><span>v2.6</span></div>
        <div className="model-stage">
          <div className="model-core"><BrainCircuit size={28}/></div>
          <span className="core-line line-a" />
          <span className="core-line line-b" />
          <span className="core-line line-c" />
        </div>
        <div className="model-metrics">
          <div><span>ACCURACY</span><b>94.8%</b><u><i style={{width:"94.8%"}}/></u></div>
          <div><span>DATA</span><b>12.4K</b><u><i style={{width:"78%"}}/></u></div>
          <div><span>LATENCY</span><b>42ms</b><u><i style={{width:"42%"}}/></u></div>
        </div>
      </div>
      <div className="signal-line s1"/><div className="signal-line s2"/>
      <div className="lab-bottom"><span>PYTHON</span><span>PANDAS</span><span>LANGCHAIN</span><span>SQL</span></div>
    </div>
  );
}


function LiveModelLab() {
  const [game, setGame] = useState(null);
  const [round, setRound] = useState(0);
  const [message, setMessage] = useState("");
  const [guess, setGuess] = useState(null);
  const [secret, setSecret] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [score, setScore] = useState(0);
  const [busy, setBusy] = useState(false);

  function startGame(type) {
    setGame(type);
    setRound(r => r + 1);
    setMessage("");
    setGuess(null);
    setBusy(false);
    setSecret(Math.floor(Math.random() * 10) + 1);
  }

  function predictNumber(n) {
    if (busy) return;
    setGuess(n);
    setBusy(true);
    const correct = n === secret;
    if (correct) setScore(s => s + 100);
    window.setTimeout(() => {
      setMessage(correct ? "AI PREDICTION HIT" : "MODEL OUTSMARTED");
      setBusy(false);
    }, 700);
  }

  function foolAI() {
    setBusy(true);
    setMessage("");
    window.setTimeout(() => {
      setMessage("MODEL ANALYZED YOUR INPUT");
      setBusy(false);
    }, 800);
  }

  return (
    <div className="ai-playground">
      <div className="playground-grid" />
      <div className="playground-scan" />
      <div className="playground-head">
        <div>
          <span className="play-kicker"><i /> AI INTERACTION ZONE</span>
          <h3>AI <em>PLAYGROUND</em></h3>
          <p>Don't just read about AI. <b>Play with it.</b> Run a tiny experiment inside the portfolio.</p>
        </div>
        <div className="play-score"><span>SCORE</span><b>{score.toString().padStart(4,"0")}</b></div>
      </div>

      {!game && (
        <div className="game-select">
          <div className="select-title"><span>SELECT AN EXPERIMENT</span><small>03 MODULES ONLINE</small></div>
          <div className="game-cards">
            <button onClick={() => startGame("mind")}>
              <span className="game-icon">◉</span><small>01 / PREDICT</small><strong>READ MY<br/><em>MIND</em></strong><p>Think of a number. Let the model try to find it.</p><b>START →</b>
            </button>
            <button onClick={() => startGame("fool")}>
              <span className="game-icon">◇</span><small>02 / CHALLENGE</small><strong>FOOL THE<br/><em>AI</em></strong><p>Give the model a challenge and see its confidence react.</p><b>START →</b>
            </button>
            <button onClick={() => startGame("build")}>
              <span className="game-icon">✦</span><small>03 / BUILDER</small><strong>BUILD<br/><em>AI</em></strong><p>Assemble a tiny intelligence pipeline from data to output.</p><b>START →</b>
            </button>
          </div>
        </div>
      )}

      {game === "mind" && (
        <div className="game-screen mind-game">
          <div className="game-topline"><span>EXPERIMENT 01 / NEURAL GUESS</span><button onClick={() => setGame(null)}>← ALL EXPERIMENTS</button></div>
          <div className="mind-stage">
            <div className={"mind-core " + (busy ? "thinking" : "")}><BrainCircuit size={34}/><span>{busy ? "ANALYZING" : message || "THINK 1–10"}</span></div>
            <div className="mind-orbit o1"/><div className="mind-orbit o2"/>
            {[1,2,3,4,5,6].map(n => <i key={n} className={"mind-node mn"+n}/>)}
          </div>
          <div className="number-row">{[1,2,3,4,5,6,7,8,9,10].map(n => <button key={n} className={guess===n ? "chosen" : ""} onClick={() => predictNumber(n)}>{n}</button>)}</div>
          <p className="game-instruction">{message || "Choose the number you think the AI is thinking about."}</p>
          {message && <button className="again-btn" onClick={() => startGame("mind")}>PLAY AGAIN →</button>}
        </div>
      )}

      {game === "fool" && (
        <div className="game-screen fool-game">
          <div className="game-topline"><span>EXPERIMENT 02 / MODEL STRESS TEST</span><button onClick={() => setGame(null)}>← ALL EXPERIMENTS</button></div>
          <div className="fool-center">
            <div className="ai-face"><span>AI</span><i/><i/><i/></div>
            <div className="confidence-ring"><strong>{busy ? "..." : "93%"}</strong><span>CONFIDENCE</span></div>
            <p>Try to fool the model.</p>
            <textarea placeholder="Type anything that might confuse the AI…" />
            <button className="again-btn" onClick={foolAI}>{busy ? "ANALYZING…" : "CHALLENGE MODEL →"}</button>
            {message && <small>{message}</small>}
          </div>
        </div>
      )}

      {game === "build" && (
        <div className="game-screen build-game">
          <div className="game-topline"><span>EXPERIMENT 03 / MODEL BUILDER</span><button onClick={() => setGame(null)}>← ALL EXPERIMENTS</button></div>
          <div className="pipeline">
            <div className="pipe-node active"><span>01</span><b>DATA</b></div>
            <div className="pipe-arrow">→</div>
            <div className="pipe-node"><span>02</span><b>PROCESS</b></div>
            <div className="pipe-arrow">→</div>
            <div className="pipe-node"><span>03</span><b>MODEL</b></div>
            <div className="pipe-arrow">→</div>
            <div className="pipe-node"><span>04</span><b>OUTPUT</b></div>
          </div>
          <div className="build-core"><div><BrainCircuit size={34}/><span>INTELLIGENCE ONLINE</span></div></div>
          <button className="again-btn" onClick={() => startGame("build")}>REBUILD MODEL →</button>
        </div>
      )}

      <div className="playground-footer"><span>HUMAN INPUT → AI PROCESSING → INTERACTIVE OUTPUT</span><b>LAB ONLINE</b></div>
    </div>
  );
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
  usePointerGlow();
  const [dark, setDark] = useState(() => localStorage.getItem("theme") !== "light");
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return <div className="app">
    <InteractiveField dark={dark}/>
    <header className="nav">
      <a className="brand" href="#"><span className="brand-mark">T</span><span>TAYYAB SAYYAD</span></a>
      <div className="navlinks"><a href="#about">About</a><a href="#work">Work</a><a href="#skills">Skills</a><a href="#contact">Contact</a></div>
      <div className="nav-right"><button className="theme-toggle" onClick={() => setDark(v => !v)}>{dark ? <Sun size={15}/> : <Moon size={15}/>}<span>{dark ? "Light" : "Dark"}</span></button><a className="nav-cta" href={profile.github} target="_blank" rel="noreferrer"><Github size={15}/> GitHub</a></div>
    </header>

    <div className="skills-marquee" aria-label="Tayyab's skills">
      <div className="skills-marquee-track">
        <span>PYTHON</span><i>✦</i><span>AI / ML</span><i>✦</i><span>LANGCHAIN</span><i>✦</i><span>RAG</span><i>✦</i><span>REACT</span><i>✦</i><span>JAVASCRIPT</span><i>✦</i><span>SQL</span><i>✦</i><span>POSTGRESQL</span><i>✦</i><span>THREE.JS</span><i>✦</i><span>DATA ANALYTICS</span><i>✦</i><span>GITHUB</span><i>✦</i>
        <span>PYTHON</span><i>✦</i><span>AI / ML</span><i>✦</i><span>LANGCHAIN</span><i>✦</i><span>RAG</span><i>✦</i><span>REACT</span><i>✦</i><span>JAVASCRIPT</span><i>✦</i><span>SQL</span><i>✦</i><span>POSTGRESQL</span><i>✦</i><span>THREE.JS</span><i>✦</i><span>DATA ANALYTICS</span><i>✦</i><span>GITHUB</span><i>✦</i>
      </div>
    </div>

    <main>
      <section className="hero" id="about">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot"/> ARTIFICIAL INTELLIGENCE / DATA SCIENCE</div>
          <h1>I turn <em>data</em><br/>into intelligence.</h1>
          <p>{profile.tagline} Explore my work, interact with my AI assistant, and see how I turn ideas into working products.</p>
          <div className="hero-actions"><a className="primary" href="#work">Explore my work <ArrowUpRight size={17}/></a><a className="secondary" href="#contact">Let's connect <MessageCircle size={17}/></a></div>
          <div className="scroll-hint"><MousePointer2 size={14}/> Explore the model, data and systems I build</div>
        </div>
        <AILab/>
    </section>

      <section className="section intro">
        <div className="section-label">01 — UNDERSTAND</div>
        <div className="intro-grid">
          <h2>Ideas are easy.<br/><em>Building them is the craft.</em></h2>
          <div><p>I’m a developer focused on practical AI, data and full-stack systems. I like turning complex ideas into interfaces people can actually use.</p><div className="mini-stats"><div><b>AI / ML</b><span>Intelligent systems</span></div><div><b>DATA</b><span>Analytics & statistics</span></div><div><b>WEB</b><span>Modern products</span></div></div></div>
        </div>
      </section>

      <div className="section-flow-wrap" aria-hidden="true">
        <div className="section-flow-line"><span className="section-flow-orb"/></div>
      </div>

      <section className="section work" id="work">
        <div className="section-label">02 — ENGINEER</div>
        <div className="section-heading"><h2>Selected <em>missions.</em></h2><span>Hover a project</span></div>
        <div className="project-grid">{projects.map((p,i) => { const Icon=p.icon; return <article className="project-card" key={p.title}>
          <div className="project-number">0{i+1}</div><div className="project-icon"><Icon size={22}/></div><span className="project-type">CASE STUDY / 0{i+1}</span>
          <h3>{p.title}</h3><p>{p.text}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>
          <a href={profile.github} target="_blank" rel="noreferrer">View on GitHub <ExternalLink size={14}/></a>
          <div className="project-hover"><span>BUILD</span><b>→</b></div>
        </article>})}</div>
      </section>

      <section className="section systems">
        <div className="section-label">03 — MODEL</div>
        <h2>A toolkit for <em>building intelligence.</em></h2>
        <div className="skill-grid">{skillGroups.map(g => <div className="skill-group" key={g.title}><span className="group-title">{g.title}</span>{g.items.map((s,i)=><div className="skill-row" key={s}><small>0{i+1}</small><b>{s}</b><span>↗</span></div>)}</div>)}</div>
        <LiveModelLab/>
      </section>

      <section className="section language-section" id="skills">
        <div className="section-label">04 — DATA STACK</div>
        <div className="language-layout"><div><h2>Code is a <em>language.</em></h2><p>From Python and SQL to JavaScript and React, I use technology as a medium for solving problems.</p></div><div className="language-bars">{[["Python","AI • Data • Automation","92%"],["JavaScript","Web • React • UI","84%"],["SQL","Database • Analytics","78%"],["C / Java","Core programming","65%"]].map(x=><div className="language-bar" key={x[0]}><div><b>{x[0]}</b><span>{x[1]}</span><i>{x[2]}</i></div><u><span style={{width:x[2]}}/></u></div>)}</div></div>
      </section>

      <section className="section learning">
        <div className="section-label">05 — RESEARCH / LEARN</div>
        <div className="learning-grid"><div><h2>Always <em>evolving.</em></h2><p>Currently exploring AI engineering, LLM applications, data science and emerging computing.</p></div><div className="learning-cards"><article><Atom/><b>AI & ML</b><span>LLMs, RAG and intelligent systems</span></article><article><Database/><b>Data Science</b><span>Statistics, Python and analytics</span></article><article><Code2/><b>Full Stack</b><span>React, APIs and databases</span></article></div></div>
      </section>

      <section className="section contact" id="contact">
        <div className="contact-box"><div className="section-label">06 — CONNECT</div><h2>Have an idea?<br/><em>Let's build it.</em></h2><p>AI, data, web development or an interesting experiment — I'm always open to meaningful projects and conversations.</p><div className="contact-actions"><a className="primary" href={profile.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17}/> WhatsApp</a><a className="secondary" href={"mailto:"+profile.email}><Mail size={17}/> Email</a><a className="secondary" href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17}/> LinkedIn</a></div></div>
      </section>
    </main>

    <footer><span>© {new Date().getFullYear()} {profile.name}</span><span>DATA → MODELS → INTELLIGENCE</span></footer>
    <Chatbot/>
  </div>;
}

createRoot(document.getElementById("root")).render(<App />);

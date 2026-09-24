import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import * as THREE from "three";
import { ArrowUpRight, Bot, Github, Linkedin, Mail, MessageCircle, Send, Sparkles, Download, ExternalLink, Sun, Moon } from "lucide-react";
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
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    ref.current.appendChild(renderer.domElement);

    // Galaxy particle field
    const galaxy = new THREE.Group();
    const count = 4200;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const arms = 5;
    const radius = 15;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 0.58) * radius;
      const arm = i % arms;
      const spin = (arm / arms) * Math.PI * 2 + r * 0.72;
      const spread = (Math.random() - 0.5) * (0.55 + r * 0.055);
      positions[i3] = Math.cos(spin) * r + spread;
      positions[i3 + 1] = (Math.random() - 0.5) * (0.45 + r * 0.035);
      positions[i3 + 2] = Math.sin(spin) * r + spread;
      sizes[i] = Math.random() * 1.8 + 0.4;
    }

    const galaxyGeometry = new THREE.BufferGeometry();
    galaxyGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    galaxyGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const galaxyMaterial = new THREE.PointsMaterial({
      color: 0x9ec5ff,
      size: 0.045,
      transparent: true,
      opacity: 0.82,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
    galaxy.rotation.x = 0.35;
    galaxy.add(galaxyPoints);
    scene.add(galaxy);

    // Glowing geometric objects
    const objects = [];
    const makeOrb = (geometry, color, scale, position) => {
      const group = new THREE.Group();
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.28 })
      );
      const glow = new THREE.Mesh(
        geometry.clone(),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.045, blending: THREE.AdditiveBlending })
      );
      glow.scale.setScalar(1.45);
      group.add(mesh, glow);
      group.position.set(...position);
      group.scale.setScalar(scale);
      scene.add(group);
      objects.push({ group, mesh, speed: 0.002 + Math.random() * 0.003, phase: Math.random() * 6.28 });
    };

    makeOrb(new THREE.IcosahedronGeometry(1, 1), 0x5ee7df, 1.15, [-5.2, 1.7, -1]);
    makeOrb(new THREE.OctahedronGeometry(1.1, 1), 0x9b8cff, 0.9, [5.1, -1.1, -1.5]);
    makeOrb(new THREE.TorusKnotGeometry(0.75, 0.18, 80, 12), 0x76a8ff, 0.72, [3.2, 2.8, -2.5]);

    // Central energy core
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.75, 2),
      new THREE.MeshBasicMaterial({ color: 0x5ee7df, wireframe: true, transparent: true, opacity: 0.32 })
    );
    scene.add(core);

    const mouseMove = e => {
      pointer.current.x = (e.clientX / innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / innerHeight - 0.5) * 2;
    };
    addEventListener("pointermove", mouseMove);

    let frame;
    const animate = time => {
      frame = requestAnimationFrame(animate);
      const t = time * 0.001;

      // Camera parallax follows the mouse
      camera.position.x += (pointer.current.x * 0.8 - camera.position.x) * 0.025;
      camera.position.y += (-pointer.current.y * 0.5 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);

      galaxy.rotation.y += 0.0011;
      galaxy.rotation.z = Math.sin(t * 0.08) * 0.08;

      core.rotation.x += 0.003;
      core.rotation.y += 0.004;
      core.position.x += (pointer.current.x * 0.35 - core.position.x) * 0.018;
      core.position.y += (-pointer.current.y * 0.22 - core.position.y) * 0.018;
      core.scale.setScalar(1 + Math.sin(t * 2.2) * 0.08);

      objects.forEach(({ group, mesh, speed, phase }) => {
        mesh.rotation.x += speed;
        mesh.rotation.y += speed * 1.25;
        group.position.x += ((group.userData.baseX || group.position.x) + pointer.current.x * 0.38 - group.position.x) * 0.012;
        group.position.y += ((group.userData.baseY || group.position.y) - pointer.current.y * 0.28 - group.position.y) * 0.012;
        group.rotation.z = Math.sin(t + phase) * 0.22;
        group.position.z += Math.sin(t * 0.7 + phase) * 0.002;
      });

      renderer.render(scene, camera);
    };

    objects.forEach(({ group }) => {
      group.userData.baseX = group.position.x;
      group.userData.baseY = group.position.y;
    });

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
      galaxyGeometry.dispose();
      galaxyMaterial.dispose();
      objects.forEach(({ group }) => {
        group.traverse(child => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      });
      core.geometry.dispose();
      core.material.dispose();
      ref.current?.removeChild(renderer.domElement);
    };
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
    setMessages(m => [...m, { role: "user", content: q }]); setInput(""); setBusy(true);
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
      <div className="chat-body">{messages.map((m,i)=><div key={i} className={"bubble "+m.role}>{m.content}</div>)}{busy&&<div className="bubble assistant">Thinking…</div>}</div>
      <div className="chat-input"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask about Tayyab…"/><button onClick={send}><Send size={18}/></button></div>
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
    <Space />
    <nav className="nav">
      <a className="brand" href="#">TS<span>.</span></a>
      <div className="navlinks"><a href="#about">About</a><a href="#work">Work</a><a href="#skills">Skills</a><a href="#contact">Contact</a></div>
      <div className="nav-right">
        <button className="theme-toggle" onClick={() => setDark(v=>!v)} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} title={dark ? "Light theme" : "Dark theme"}>{dark ? <Sun size={17}/> : <Moon size={17}/>}<span>{dark ? "Light" : "Dark"}</span></button>
        <a className="nav-cta" href={profile.github} target="_blank" rel="noreferrer"><Github size={16}/> GitHub</a>
      </div>
    </nav>
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

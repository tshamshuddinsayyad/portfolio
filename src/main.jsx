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
    const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, .1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x000000, 0);
    ref.current?.appendChild(renderer.domElement);

    const palette = dark
      ? { star: 0xb9dfff, accent: 0x61f4df, cloud: 0x6e8fc9 }
      : { star: 0x376f91, accent: 0x087f86, cloud: 0x8bb9cf };

    // A calm 3D sky: tiny stars, drifting dust, soft clouds and a distant moon.
    const sky = new THREE.Group();
    scene.add(sky);

    // Tiny star field — deliberately small and sparse.
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(1800 * 3);
    const starSizes = new Float32Array(1800);

    for (let i = 0; i < 1800; i++) {
      const radius = 10 + Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - .5) * 16;
      starPositions[i * 3] = Math.cos(theta) * radius;
      starPositions[i * 3 + 1] = y;
      starPositions[i * 3 + 2] = -5 - Math.random() * 25;
      starSizes[i] = .018 + Math.random() * .035;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        color: palette.star,
        size: dark ? .035 : .045,
        transparent: true,
        opacity: dark ? .58 : .30,
        sizeAttenuation: true
      })
    );
    sky.add(stars);

    // A second, much smaller dust layer gives the sky depth.
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(420 * 3);

    for (let i = 0; i < 420; i++) {
      dustPositions[i * 3] = (Math.random() - .5) * 24;
      dustPositions[i * 3 + 1] = (Math.random() - .5) * 11;
      dustPositions[i * 3 + 2] = -2 - Math.random() * 15;
    }
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));

    const dust = new THREE.Points(
      dustGeometry,
      new THREE.PointsMaterial({
        color: palette.accent,
        size: dark ? .055 : .065,
        transparent: true,
        opacity: dark ? .18 : .10
      })
    );
    sky.add(dust);

    // Soft moon / sun-like celestial body.
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(1.15, 32, 32),
      new THREE.MeshBasicMaterial({
        color: dark ? 0x9bcfff : 0xffe8a6,
        transparent: true,
        opacity: dark ? .12 : .18
      })
    );
    moon.position.set(5.5, 3.2, -10);
    sky.add(moon);

    // Very subtle atmospheric halo.
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(1.7, 32, 32),
      new THREE.MeshBasicMaterial({
        color: palette.cloud,
        transparent: true,
        opacity: dark ? .035 : .025,
        side: THREE.BackSide
      })
    );
    halo.position.copy(moon.position);
    sky.add(halo);

    // A few tiny "meteor" particles that drift slowly across the scene.
    const meteors = [];
    for (let i = 0; i < 9; i++) {
      const meteor = new THREE.Mesh(
        new THREE.SphereGeometry(.025 + Math.random() * .025, 8, 8),
        new THREE.MeshBasicMaterial({
          color: palette.star,
          transparent: true,
          opacity: dark ? .65 : .30
        })
      );
      meteor.position.set(
        -11 + Math.random() * 22,
        -2 + Math.random() * 10,
        -5 - Math.random() * 12
      );
      sky.add(meteor);
      meteors.push({
        meteor,
        speed: .12 + Math.random() * .18,
        phase: Math.random() * 6.28
      });
    }

    const mouseMove = e => {
      pointer.current.x = (e.clientX / innerWidth - .5) * 2;
      pointer.current.y = (e.clientY / innerHeight - .5) * 2;
    };
    addEventListener("pointermove", mouseMove);

    let frame;
    const animate = time => {
      frame = requestAnimationFrame(animate);
      const t = time * .001;

      // Gentle camera parallax, like looking through a window into the sky.
      camera.position.x += (pointer.current.x * .55 - camera.position.x) * .018;
      camera.position.y += (-pointer.current.y * .35 - camera.position.y) * .018;
      camera.lookAt(0, 0, -5);

      // Slow sky drift, not rotation.
      stars.position.x = Math.sin(t * .018) * .45;
      stars.position.y = Math.cos(t * .015) * .20;
      dust.position.x = Math.sin(t * .035) * .8;
      dust.position.y = Math.cos(t * .028) * .35;

      moon.position.y = 3.2 + Math.sin(t * .12) * .08;
      halo.position.copy(moon.position);
      halo.scale.setScalar(1 + Math.sin(t * .18) * .035);

      meteors.forEach(({ meteor, speed, phase }) => {
        meteor.position.x += speed * .008;
        meteor.position.y += Math.sin(t * .2 + phase) * .0007;
        if (meteor.position.x > 12) meteor.position.x = -12;
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
      starGeometry.dispose();
      dustGeometry.dispose();
      stars.material.dispose();
      dust.material.dispose();
      sky.traverse(o => {
        o.geometry?.dispose();
        o.material?.dispose();
      });
      if (ref.current?.contains(renderer.domElement)) ref.current.removeChild(renderer.domElement);
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
  const [dark,setDark]=useState(()=>localStorage.getItem("theme")!=="light");
  useEffect(()=>{document.documentElement.dataset.theme=dark?"dark":"light";localStorage.setItem("theme",dark?"dark":"light")},[dark]);

  return <div className="app">
    <Space dark={dark}/>
    <nav className="nav">
      <a className="brand" href="#">TS<span>.</span></a>
      <div className="navlinks"><a href="#about">About</a><a href="#projects">Projects</a><a href="#skills">Skills</a><a href="#languages">Languages</a><a href="#certifications">Certifications</a><a href="#contact">Contact</a></div>
      <div className="nav-right"><button className="theme-toggle" onClick={()=>setDark(v=>!v)}>{dark?<Sun size={16}/>:<Moon size={16}/>}<span>{dark?"Light":"Dark"}</span></button><a className="nav-cta" href={profile.github} target="_blank" rel="noreferrer"><Github size={16}/> GitHub</a></div>
    </nav>

    <main>
      <section className="hero" id="about">
        <div className="hero-copy">
          <div className="eyebrow"><span className="signal"/> AI • DATA • ROBOTICS • QUANTUM</div>
          <h1>Hi, I'm <em>Tayyab</em><br/>AI & Data Builder.</h1>
          <p>{profile.tagline} I explore machine learning, intelligent applications, robotics concepts and quantum computing.</p>
          <div className="hero-actions"><a className="primary" href="#projects">View my work <ArrowUpRight size={18}/></a><a className="secondary" href="#contact">Let's connect <MessageCircle size={18}/></a></div>
        </div>
        <div className="hero-console"><div className="console-top"><span>QUANTUM LAB / ROBOTICS CORE</span><i>LIVE</i></div><div className="core-visual"><div className="core-ring r1"/><div className="core-ring r2"/><div className="core-ring r3"/><div className="core-center"><Atom size={40}/><b>Q-BIT</b></div></div><div className="console-data"><span>AI <b>INTELLIGENCE</b></span><span>DATA <b>ANALYTICS</b></span><span>ROBOTICS <b>AUTONOMY</b></span></div></div>
      </section>

      <section className="section about-section theme-intelligence">
        <div className="section-kicker">01 / About Me</div>
        <div className="about-layout"><div><h2>Building at the intersection of <em>intelligence & engineering.</em></h2></div><div><p className="large-copy">I'm a developer focused on learning and building practical systems with AI, machine learning, data and modern web technology. My current work includes an academic AI chatbot using retrieval-augmented generation.</p><div className="about-stats"><div><b>AI / ML</b><span>Intelligent systems</span></div><div><b>DATA</b><span>Analytics & statistics</span></div><div><b>ROBOTICS</b><span>Autonomous concepts</span></div><div><b>QUANTUM</b><span>Emerging computing</span></div></div></div></div>
      </section>

      <section className="section theme-projects" id="projects">
        <div className="section-kicker">02 / Projects</div><h2>What I've <em>built.</em></h2>
        <div className="project-grid">{projects.map((p,i)=><article className="project" key={p.title}><div className="project-top"><span className="project-num">0{i+1}</span><span className="project-status"><i/> PROJECT</span></div><div className="project-icon">{i===0?<BrainCircuit/>:i===1?<Atom/>:<Database/>}</div><h3>{p.title}</h3><p>{p.text}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div><a href={profile.github} target="_blank" rel="noreferrer">View project <ArrowUpRight size={15}/></a></article>)}</div>
      </section>

      <section className="section stats-section theme-data"><div className="section-kicker">03 / Focus Areas</div><div className="focus-strip"><div><strong>AI</strong><span>LLM • RAG • Agents</span></div><div><strong>DATA</strong><span>Python • Analytics • SQL</span></div><div><strong>ML</strong><span>Models • Statistics</span></div><div><strong>ROBOTICS</strong><span>Control • Sensors</span></div><div><strong>QUANTUM</strong><span>Qubits • Circuits</span></div></div></section>

      <section className="section theme-code" id="skills"><div className="section-kicker">04 / Skills & Technologies</div><h2>My <em>technical toolkit.</em></h2><div className="skills-columns"><div><h3>Programming & Data</h3><div className="skill-cloud">{["Python","JavaScript","SQL","Pandas","Data Analytics","PostgreSQL","HTML","CSS"].map((s,i)=><span key={s}><b>0{i+1}</b>{s}</span>)}</div></div><div><h3>AI, Web & Tools</h3><div className="skill-cloud">{["React","LangChain","RAG","OpenAI","Three.js","Git","GitHub","AI/ML"].map((s,i)=><span key={s}><b>0{i+1}</b>{s}</span>)}</div></div></div></section>

      <section className="section languages theme-signal" id="languages"><div className="section-kicker">05 / Languages</div><h2>Communication & <em>technical fluency.</em></h2><div className="language-grid"><div><b>Python</b><span>Programming • AI • Data</span><i><u style={{width:"92%"}}/></i></div><div><b>JavaScript</b><span>Web • React • Interactive UI</span><i><u style={{width:"84%"}}/></i></div><div><b>SQL</b><span>Database • Analytics</span><i><u style={{width:"78%"}}/></i></div><div><b>C / Java</b><span>Core programming</span><i><u style={{width:"65%"}}/></i></div></div></section>

      <section className="section certifications theme-quantum" id="certifications"><div className="section-kicker">06 / Certifications & Learning</div><h2>Always <em>learning.</em></h2><div className="cert-grid"><article><Atom/><div><b>AI & Machine Learning</b><span>Continuous learning in ML, LLMs and intelligent systems</span></div></article><article><Database/><div><b>Data Science</b><span>Statistics, Python analytics and data-driven problem solving</span></div></article><article><Code2/><div><b>Full Stack Development</b><span>React, APIs, databases and modern web engineering</span></div></article></div></section>

      <section className="section contact theme-contact" id="contact"><div className="contact-terminal"><div className="terminal-head"><span>CONTACT</span><span>AVAILABLE</span></div><div className="terminal-body"><h2>Let's <em>connect.</em></h2><p>Interested in AI, data science, machine learning, robotics or emerging quantum technology? Let's build something useful.</p><div className="contact-actions"><a className="primary" href={profile.whatsapp} target="_blank" rel="noreferrer"><MessageCircle/> WhatsApp</a><a className="secondary" href={"mailto:"+profile.email}><Mail/> Email</a><a className="secondary" href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin/> LinkedIn</a></div></div></div></section>
    </main>
    <footer><span>© {new Date().getFullYear()} {profile.name}</span><span>AI • DATA • ML • ROBOTICS • QUANTUM</span></footer><Chatbot/>
  </div>;
}
createRoot(document.getElementById("root")).render(<App />);
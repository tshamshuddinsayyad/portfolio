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
    const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.1, 100);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x000000, 0);
    ref.current?.appendChild(renderer.domElement);

    const palette = dark
      ? { cyan: 0x61f4df, violet: 0x9a83ff, blue: 0x54a9ff }
      : { cyan: 0x087f86, violet: 0x7354c9, blue: 0x1677c8 };

    /*
      NEW VISUAL SYSTEM:
      A 3D "AEROSPACE DATA GARDEN" — flowing glass ribbons, floating
      architectural shards and a deep particle field. Nothing is a
      standard rotating ring or neural network.
    */
    const world = new THREE.Group();
    scene.add(world);

    // Flowing 3D ribbons. Their curves continuously deform in space.
    const ribbons = [];
    const ribbonDefs = [
      { y: 2.0, z: -1.0, amp: 1.15, freq: .72, color: palette.cyan, phase: 0 },
      { y: -1.0, z: -2.5, amp: .85, freq: .56, color: palette.violet, phase: 2.1 },
      { y: .2, z: -4.0, amp: 1.45, freq: .42, color: palette.blue, phase: 4.0 }
    ];

    ribbonDefs.forEach((def, ri) => {
      const count = 90;
      const positions = new Float32Array(count * 3);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const material = new THREE.LineBasicMaterial({
        color: def.color,
        transparent: true,
        opacity: dark ? (ri === 0 ? .42 : .25) : (ri === 0 ? .25 : .14)
      });

      const line = new THREE.Line(geometry, material);
      world.add(line);
      ribbons.push({ line, positions, count, ...def });
    });

    // Floating glass-like 3D shards.
    const shards = [];
    for (let i = 0; i < 22; i++) {
      const geometry = i % 2
        ? new THREE.OctahedronGeometry(.22 + Math.random() * .35, 0)
        : new THREE.BoxGeometry(.25 + Math.random() * .45, .25 + Math.random() * .45, .08 + Math.random() * .22);

      const material = new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? palette.cyan : i % 3 === 1 ? palette.violet : palette.blue,
        wireframe: true,
        transparent: true,
        opacity: dark ? .22 : .12
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - .5) * 16,
        (Math.random() - .5) * 9,
        -1 - Math.random() * 9
      );
      mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
      world.add(mesh);

      shards.push({
        mesh,
        phase: Math.random() * Math.PI * 2,
        speed: .18 + Math.random() * .28,
        drift: .15 + Math.random() * .35,
        baseX: mesh.position.x,
        baseY: mesh.position.y
      });
    }

    // Fine atmospheric particles.
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      particlePositions[i * 3] = (Math.random() - .5) * 24;
      particlePositions[i * 3 + 1] = (Math.random() - .5) * 14;
      particlePositions[i * 3 + 2] = -2 - Math.random() * 16;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: palette.blue,
        size: dark ? .028 : .038,
        transparent: true,
        opacity: dark ? .28 : .14
      })
    );
    world.add(particles);

    // Soft central light plane, like a distant holographic horizon.
    const horizon = new THREE.Mesh(
      new THREE.PlaneGeometry(28, 7),
      new THREE.MeshBasicMaterial({
        color: palette.cyan,
        transparent: true,
        opacity: dark ? .018 : .025,
        side: THREE.DoubleSide
      })
    );
    horizon.position.set(0, -3.2, -8);
    world.add(horizon);

    const mouseMove = e => {
      pointer.current.x = (e.clientX / innerWidth - .5) * 2;
      pointer.current.y = (e.clientY / innerHeight - .5) * 2;
    };
    addEventListener("pointermove", mouseMove);

    let frame;
    const animate = time => {
      frame = requestAnimationFrame(animate);
      const t = time * .001;

      // Camera follows the mouse for a genuine 3D parallax effect.
      camera.position.x += (pointer.current.x * 1.25 - camera.position.x) * .025;
      camera.position.y += (-pointer.current.y * .7 - camera.position.y) * .025;
      camera.lookAt(0, 0, -3);

      // Deform every ribbon in 3D.
      ribbons.forEach(r => {
        const attr = r.line.geometry.attributes.position;
        for (let i = 0; i < r.count; i++) {
          const u = i / (r.count - 1);
          const x = (u - .5) * 24;
          const y =
            r.y +
            Math.sin(x * r.freq + t * .65 + r.phase) * r.amp +
            Math.sin(x * .25 - t * .35 + r.phase) * .42;
          const z =
            r.z +
            Math.cos(x * .22 + t * .28 + r.phase) * 1.4 +
            Math.sin(x * .08 + t * .2) * .7;

          attr.setXYZ(i, x, y, z);
        }
        attr.needsUpdate = true;
      });

      shards.forEach(s => {
        s.mesh.position.x = s.baseX + Math.sin(t * s.speed + s.phase) * s.drift;
        s.mesh.position.y = s.baseY + Math.cos(t * s.speed * .7 + s.phase) * s.drift;
        s.mesh.rotation.x += .0015;
        s.mesh.rotation.y += .001;
      });

      particles.position.x = Math.sin(t * .08) * .25;
      particles.position.y = Math.cos(t * .06) * .16;
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
      particles.material.dispose();
      world.traverse(o => {
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
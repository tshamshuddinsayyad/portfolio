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
    const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 12);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
    renderer.setSize(innerWidth, innerHeight);
    ref.current?.appendChild(renderer.domElement);

    const palette = dark
      ? { a: 0x61f4df, b: 0x987cff, c: 0x54a9ff }
      : { a: 0x087f86, b: 0x6b50c9, c: 0x1677c8 };

    // A quantum processor + robotic sensor scene, intentionally different from a neural-network background.
    const lab = new THREE.Group();
    scene.add(lab);

    const chip = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 0.55, 3.8),
      new THREE.MeshBasicMaterial({ color: palette.c, wireframe: true, transparent: true, opacity: dark ? .38 : .2 })
    );
    chip.rotation.x = -.55;
    chip.rotation.z = .12;
    lab.add(chip);

    const qubits = [];
    for (let i=0;i<16;i++){
      const x=(i%4-1.5)*.82, z=(Math.floor(i/4)-1.5)*.82;
      const q=new THREE.Mesh(
        new THREE.SphereGeometry(.16,16,16),
        new THREE.MeshBasicMaterial({color:i%3===0?palette.a:palette.b,transparent:true,opacity:.9})
      );
      q.position.set(x,.42,z);
      lab.add(q); qubits.push({q,phase:i*.4});
    }

    const rings=[];
    [2.2,2.65,3.1].forEach((r,i)=>{
      const ring=new THREE.Mesh(
        new THREE.TorusGeometry(r,.018,8,120),
        new THREE.MeshBasicMaterial({color:i===1?palette.b:palette.a,transparent:true,opacity:dark?.32:.17})
      );
      ring.rotation.set(i*.7,.2+i*.5,i*.4); lab.add(ring); rings.push(ring);
    });

    // Robotic arm silhouette around the processor.
    const armMat=new THREE.MeshBasicMaterial({color:palette.a,wireframe:true,transparent:true,opacity:dark?.46:.25});
    const arm1=new THREE.Mesh(new THREE.CylinderGeometry(.14,.18,2.6,12),armMat);
    const arm2=new THREE.Mesh(new THREE.CylinderGeometry(.12,.16,2.1,12),armMat);
    const joint1=new THREE.Mesh(new THREE.SphereGeometry(.28,16,16),armMat);
    const joint2=new THREE.Mesh(new THREE.SphereGeometry(.23,16,16),armMat);
    arm1.position.set(-3.2,1.1,0); arm1.rotation.z=-.48;
    joint1.position.set(-2.35,2.05,0);
    arm2.position.set(-1.55,2.55,0); arm2.rotation.z=.72;
    joint2.position.set(-.78,3.25,0);
    lab.add(arm1,arm2,joint1,joint2);

    const dataGeometry=new THREE.BufferGeometry();
    const pts=new Float32Array(900*3);
    for(let i=0;i<900;i++){const a=Math.random()*Math.PI*2,r=4+Math.random()*9;pts[i*3]=Math.cos(a)*r;pts[i*3+1]=(Math.random()-.5)*8;pts[i*3+2]=Math.sin(a)*r-4;}
    dataGeometry.setAttribute("position",new THREE.BufferAttribute(pts,3));
    const data=new THREE.Points(dataGeometry,new THREE.PointsMaterial({color:palette.c,size:dark?.035:.045,transparent:true,opacity:dark?.4:.22}));
    scene.add(data);

    const mouseMove=e=>{pointer.current.x=(e.clientX/innerWidth-.5)*2;pointer.current.y=(e.clientY/innerHeight-.5)*2};
    addEventListener("pointermove",mouseMove);
    let frame;
    const animate=time=>{
      frame=requestAnimationFrame(animate); const t=time*.001;
      camera.position.x+=(pointer.current.x*.8-camera.position.x)*.02;
      camera.position.y+=(-pointer.current.y*.45-camera.position.y)*.02; camera.lookAt(0,0,0);
      lab.rotation.y+=dark?.0012:-.0008;
      chip.rotation.y+=.001;
      rings.forEach((r,i)=>{r.rotation.x+=.001*(i+1);r.rotation.y+=.0015*(i+1)});
      qubits.forEach(({q,phase})=>{q.position.y=.42+Math.sin(t*2+phase)*.13;q.scale.setScalar(1+Math.sin(t*2+phase)*.25)});
      joint1.position.y=2.05+Math.sin(t)*.08;
      data.rotation.y+=.00025;
      renderer.render(scene,camera);
    };
    animate(0);
    const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)};
    addEventListener("resize",resize);
    return()=>{cancelAnimationFrame(frame);removeEventListener("resize",resize);removeEventListener("pointermove",mouseMove);renderer.dispose();dataGeometry.dispose();data.material.dispose();lab.traverse(o=>{o.geometry?.dispose();o.material?.dispose()});ref.current?.contains(renderer.domElement)&&ref.current.removeChild(renderer.domElement)};
  },[dark]);
  return <div className={dark?"space space-dark":"space space-light"} ref={ref}/>;
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

      <section className="section about-section">
        <div className="section-kicker">01 / About Me</div>
        <div className="about-layout"><div><h2>Building at the intersection of <em>intelligence & engineering.</em></h2></div><div><p className="large-copy">I'm a developer focused on learning and building practical systems with AI, machine learning, data and modern web technology. My current work includes an academic AI chatbot using retrieval-augmented generation.</p><div className="about-stats"><div><b>AI / ML</b><span>Intelligent systems</span></div><div><b>DATA</b><span>Analytics & statistics</span></div><div><b>ROBOTICS</b><span>Autonomous concepts</span></div><div><b>QUANTUM</b><span>Emerging computing</span></div></div></div></div>
      </section>

      <section className="section" id="projects">
        <div className="section-kicker">02 / Projects</div><h2>What I've <em>built.</em></h2>
        <div className="project-grid">{projects.map((p,i)=><article className="project" key={p.title}><div className="project-top"><span className="project-num">0{i+1}</span><span className="project-status"><i/> PROJECT</span></div><div className="project-icon">{i===0?<BrainCircuit/>:i===1?<Atom/>:<Database/>}</div><h3>{p.title}</h3><p>{p.text}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div><a href={profile.github} target="_blank" rel="noreferrer">View project <ArrowUpRight size={15}/></a></article>)}</div>
      </section>

      <section className="section stats-section"><div className="section-kicker">03 / Focus Areas</div><div className="focus-strip"><div><strong>AI</strong><span>LLM • RAG • Agents</span></div><div><strong>DATA</strong><span>Python • Analytics • SQL</span></div><div><strong>ML</strong><span>Models • Statistics</span></div><div><strong>ROBOTICS</strong><span>Control • Sensors</span></div><div><strong>QUANTUM</strong><span>Qubits • Circuits</span></div></div></section>

      <section className="section" id="skills"><div className="section-kicker">04 / Skills & Technologies</div><h2>My <em>technical toolkit.</em></h2><div className="skills-columns"><div><h3>Programming & Data</h3><div className="skill-cloud">{["Python","JavaScript","SQL","Pandas","Data Analytics","PostgreSQL","HTML","CSS"].map((s,i)=><span key={s}><b>0{i+1}</b>{s}</span>)}</div></div><div><h3>AI, Web & Tools</h3><div className="skill-cloud">{["React","LangChain","RAG","OpenAI","Three.js","Git","GitHub","AI/ML"].map((s,i)=><span key={s}><b>0{i+1}</b>{s}</span>)}</div></div></div></section>

      <section className="section languages" id="languages"><div className="section-kicker">05 / Languages</div><h2>Communication & <em>technical fluency.</em></h2><div className="language-grid"><div><b>Python</b><span>Programming • AI • Data</span><i><u style={{width:"92%"}}/></i></div><div><b>JavaScript</b><span>Web • React • Interactive UI</span><i><u style={{width:"84%"}}/></i></div><div><b>SQL</b><span>Database • Analytics</span><i><u style={{width:"78%"}}/></i></div><div><b>C / Java</b><span>Core programming</span><i><u style={{width:"65%"}}/></i></div></div></section>

      <section className="section certifications" id="certifications"><div className="section-kicker">06 / Certifications & Learning</div><h2>Always <em>learning.</em></h2><div className="cert-grid"><article><Atom/><div><b>AI & Machine Learning</b><span>Continuous learning in ML, LLMs and intelligent systems</span></div></article><article><Database/><div><b>Data Science</b><span>Statistics, Python analytics and data-driven problem solving</span></div></article><article><Code2/><div><b>Full Stack Development</b><span>React, APIs, databases and modern web engineering</span></div></article></div></section>

      <section className="section contact" id="contact"><div className="contact-terminal"><div className="terminal-head"><span>CONTACT</span><span>AVAILABLE</span></div><div className="terminal-body"><h2>Let's <em>connect.</em></h2><p>Interested in AI, data science, machine learning, robotics or emerging quantum technology? Let's build something useful.</p><div className="contact-actions"><a className="primary" href={profile.whatsapp} target="_blank" rel="noreferrer"><MessageCircle/> WhatsApp</a><a className="secondary" href={"mailto:"+profile.email}><Mail/> Email</a><a className="secondary" href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin/> LinkedIn</a></div></div></div></section>
    </main>
    <footer><span>© {new Date().getFullYear()} {profile.name}</span><span>AI • DATA • ML • ROBOTICS • QUANTUM</span></footer><Chatbot/>
  </div>;
}
createRoot(document.getElementById("root")).render(<App />);
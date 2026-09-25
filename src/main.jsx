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
  const [score, setScore] = useState(0);

  function startGame(type) { setGame(type); }
  function back() { setGame(null); }

  return (
    <div className="ai-playground learning-playground">
      <div className="playground-grid" />
      <div className="playground-scan" />
      <div className="playground-head">
        <div>
          <span className="play-kicker"><i /> AI & DATA SCIENCE ARCADE</span>
          <h3>Learn AI. <em>Play AI.</em></h3>
          <p>Ten interactive missions that turn AI concepts into experiments you can see, control and understand.</p>
        </div>
        <div className="play-score"><span>LEARNING SCORE</span><b>{score.toString().padStart(4,"0")}</b></div>
      </div>

      {!game && (
        <div className="game-select">
          <div className="select-title"><span>CHOOSE YOUR MISSION</span><small>10 CONCEPTS / 10 GAMES</small></div>
          <div className="game-cards">
            <GameCard n="01" icon="⌁" meta="SUPERVISED LEARNING" title={<>DATA<br/><em>DETECTIVE</em></>} text="Inspect features and train your intuition to classify messages." action="CLASSIFY" onClick={() => startGame("detective")} />
            <GameCard n="02" icon="∇" meta="MODEL TRAINING" title={<>GRADIENT<br/><em>RACE</em></>} text="Control learning rate and watch loss fall during training." action="TRAIN" onClick={() => startGame("gradient")} />
            <GameCard n="03" icon="◈" meta="LLM + RAG" title={<>RAG<br/><em>RESCUE</em></>} text="Retrieve evidence before an LLM generates its answer." action="RETRIEVE" onClick={() => startGame("rag")} />
            <GameCard n="04" icon="●" meta="CLASSIFICATION" title={<>K-NEAREST<br/><em>NEIGHBOR</em></>} text="Move a query point and let nearby examples vote." action="CLASSIFY" onClick={() => startGame("knn")} />
            <GameCard n="05" icon="▤" meta="DATA ANALYTICS" title={<>SQL<br/><em>DETECTIVE</em></>} text="Translate real questions into precise database queries." action="QUERY" onClick={() => startGame("sql")} />
            <GameCard n="06" icon="⌘" meta="NEURAL NETWORKS" title={<>NEURAL<br/><em>BUILDER</em></>} text="Activate hidden neurons and run a tiny forward pass." action="BUILD" onClick={() => startGame("neural")} />
            <GameCard n="07" icon="↗" meta="DIMENSIONALITY REDUCTION" title={<>PCA<br/><em>COMPRESSOR</em></>} text="Rotate a projection and preserve the most variance." action="REDUCE" onClick={() => startGame("pca")} />
            <GameCard n="08" icon="◇" meta="DECISION TREES" title={<>TREE<br/><em>ARCHITECT</em></>} text="Choose splits that make a decision tree more informative." action="SPLIT" onClick={() => startGame("tree")} />
            <GameCard n="09" icon="✣" meta="UNSUPERVISED LEARNING" title={<>CLUSTER<br/><em>MISSION</em></>} text="Place data, move centroids and discover hidden groups." action="CLUSTER" onClick={() => startGame("cluster")} />
            <GameCard n="10" icon="▦" meta="MODEL EVALUATION" title={<>CONFUSION<br/><em>ARENA</em></>} text="Make predictions and see precision, recall and accuracy update live." action="EVALUATE" onClick={() => startGame("matrix")} />
          </div>
          <div className="concept-strip"><span>DATA</span> → <span>FEATURES</span> → <span>MODEL</span> → <span>LOSS</span> → <span>PREDICTION</span> → <span>EVALUATION</span></div>
        </div>
      )}

      {game === "detective" && <DataDetective setScore={setScore} onBack={back} />}
      {game === "gradient" && <GradientRace setScore={setScore} onBack={back} />}
      {game === "rag" && <RagRescue setScore={setScore} onBack={back} />}
      {game === "knn" && <KNNGame setScore={setScore} onBack={back} />}
      {game === "sql" && <SQLGame setScore={setScore} onBack={back} />}
      {game === "neural" && <NeuralGame setScore={setScore} onBack={back} />}
      {game === "pca" && <PCAGame setScore={setScore} onBack={back} />}
      {game === "tree" && <DecisionTreeGame setScore={setScore} onBack={back} />}
      {game === "cluster" && <ClusterGame setScore={setScore} onBack={back} />}
      {game === "matrix" && <ConfusionMatrixGame setScore={setScore} onBack={back} />}

      <div className="playground-footer"><span>EXPERIMENT → LEARN → PREDICT → EXPLAIN</span><b>AI LAB ONLINE</b></div>
    </div>
  );
}

function GameCard({n,icon,meta,title,text,action,onClick}) {
  return <button onClick={onClick}>
    <span className="game-icon">{icon}</span><small>{n} / {meta}</small>
    <strong>{title}</strong><p>{text}</p><b>{action} →</b>
  </button>;
}

function GameTop({ label, onBack }) {
  return <div className="game-topline"><span>{label}</span><button onClick={onBack}>← ALL MISSIONS</button></div>;
}

function DataDetective({setScore,onBack}) {
  const cases=[
    {text:"WIN a FREE iPhone now!!! Click this link",features:["many_caps","link","urgency"],answer:"SPAM",why:"Spam often combines urgency, promotional language and suspicious links."},
    {text:"Reminder: your Database Systems lecture starts at 10 AM.",features:["normal_tone","no_link","specific_info"],answer:"REAL",why:"Normal language and specific context are useful classifier features."},
    {text:"Congratulations!!! You have been selected for a CASH prize.",features:["many_caps","urgency","reward"],answer:"SPAM",why:"Reward language plus urgency are strong spam indicators."}
  ];
  const [index,setIndex]=useState(0),[choice,setChoice]=useState(null); const item=cases[index];
  function classify(a){if(choice)return;setChoice(a);if(a===item.answer)setScore(s=>s+100)}
  function next(){setIndex(i=>(i+1)%cases.length);setChoice(null)}
  return <div className="game-screen concept-game"><GameTop label={"MISSION 01 / DATA DETECTIVE / CASE "+(index+1)} onBack={onBack}/>
    <div className="detective-layout"><div className="sample-message"><small>UNKNOWN MESSAGE</small><div className="message-icon">✉</div><p>“{item.text}”</p><div className="feature-list">{item.features.map(f=><span key={f}>FEATURE: {f.replace("_"," ")}</span>)}</div></div>
    <div className="classifier-panel"><span className="panel-kicker">TRAIN YOUR CLASSIFIER</span><h4>What should the model predict?</h4><div className="class-buttons"><button className={choice==="SPAM"?"picked":""} onClick={()=>classify("SPAM")}>SPAM <small>1</small></button><button className={choice==="REAL"?"picked":""} onClick={()=>classify("REAL")}>REAL <small>0</small></button></div>
    <div className={"feedback "+(choice?(choice===item.answer?"correct":"wrong"):"")}><span>{choice?<><b>{choice===item.answer?"✓ CORRECT CLASSIFICATION":"× WRONG PREDICTION"}</b><br/>{item.why}</>: "Look at the features. A model learns patterns from labelled examples."}</span></div>{choice&&<button className="again-btn" onClick={next}>NEXT CASE →</button>}</div></div>
    <div className="lesson-note"><b>WHAT YOU LEARN:</b> Classification maps <em>features</em> to labels using examples from training data.</div>
  </div>;
}

function GradientRace({setScore,onBack}) {
  const [rate,setRate]=useState(.25),[step,setStep]=useState(0);
  const loss=Math.max(.08,Math.min(1,Math.pow(1-rate*.72,step))); const position=7+(1-loss)*86; const good=rate>=.15&&rate<=.45;
  function train(){if(step>=8)return;setStep(s=>s+1);if(step===7&&good)setScore(s=>s+150)}
  return <div className="game-screen concept-game"><GameTop label="MISSION 02 / GRADIENT DESCENT RACE" onBack={onBack}/>
    <div className="gradient-head"><div><span className="panel-kicker">OPTIMIZE THE MODEL</span><h4>Find the learning rate that reaches <em>low loss.</em></h4><p>Too small = slow. Too large = unstable.</p></div><div className="loss-readout"><small>LOSS</small><b>{loss.toFixed(2)}</b></div></div>
    <div className="descent-track"><div className="track-label start">HIGH LOSS</div><div className="track-label end">LOW LOSS</div><div className="descent-path"><i style={{left:position+"%"}}/></div></div>
    <div className="rate-control"><div><span>LEARNING RATE</span><b>{rate.toFixed(2)}</b></div><input type="range" min=".05" max=".65" step=".05" value={rate} onChange={e=>{setRate(+e.target.value);setStep(0)}}/><div className="rate-labels"><small>.05 / SLOW</small><small>.65 / CHAOTIC</small></div></div>
    <div className="train-row"><div className="epoch">EPOCH <b>{step}</b> / 8</div><button className="again-btn" onClick={train}>{step>=8?"MODEL TRAINED ✓":"RUN TRAINING STEP →"}</button>{step>=8&&<span className={good?"train-good":"train-bad"}>{good?"GOOD CONVERGENCE":"TRY A DIFFERENT RATE"}</span>}</div>
    <div className="lesson-note"><b>WHAT YOU LEARN:</b> Gradient descent updates parameters to reduce a <em>loss function</em>; learning rate controls update size.</div>
  </div>;
}

function RagRescue({setScore,onBack}) {
  const questions=[
    {q:"What is the university's attendance requirement?",docs:["Library Opening Hours","Attendance Policy 2026","Python Lab Schedule"],answer:1,reason:"RAG retrieves the relevant policy before generating the answer."},
    {q:"When is the Python practical?",docs:["Hostel Rules","Exam Fee Notice","Python Lab Schedule"],answer:2,reason:"Grounding the answer in the retrieved document reduces unsupported guesses."},
    {q:"How do I reset my university password?",docs:["Password Reset Guide","Sports Day Notice","DBMS Syllabus"],answer:0,reason:"The retriever should find the document containing the procedure."}
  ];
  const [index,setIndex]=useState(0),[picked,setPicked]=useState(null); const item=questions[index];
  function choose(i){if(picked!==null)return;setPicked(i);if(i===item.answer)setScore(s=>s+120)}
  return <div className="game-screen concept-game"><GameTop label={"MISSION 03 / RAG RESCUE / QUERY "+(index+1)} onBack={onBack}/>
    <div className="rag-query"><span>USER QUERY</span><h4>“{item.q}”</h4></div>
    <div className="rag-flow"><div className="rag-step"><b>1</b><strong>RETRIEVE</strong><span>Find relevant chunks</span></div><div className="rag-arrow">→</div><div className="rag-step"><b>2</b><strong>AUGMENT</strong><span>Give context to LLM</span></div><div className="rag-arrow">→</div><div className="rag-step"><b>3</b><strong>GENERATE</strong><span>Answer from evidence</span></div></div>
    <div className="doc-grid">{item.docs.map((d,i)=><button key={d} className={picked===i?"doc-picked":""} onClick={()=>choose(i)}><span>DOC 0{i+1}</span><strong>{d}</strong><small>{picked===i?(i===item.answer?"✓ RELEVANT":"× NOT RELEVANT"):"SELECT DOCUMENT"}</small></button>)}</div>
    {picked!==null&&<div className={"rag-feedback "+(picked===item.answer?"correct":"wrong")}><b>{picked===item.answer?"✓ RETRIEVAL SUCCESS":"× WRONG DOCUMENT"}</b><span>{item.reason}</span><button className="again-btn" onClick={()=>{setIndex(i=>(i+1)%questions.length);setPicked(null)}}>NEXT QUERY →</button></div>}
    <div className="lesson-note"><b>WHAT YOU LEARN:</b> RAG = <em>retrieve trusted context → augment the prompt → generate a grounded answer.</em></div>
  </div>;
}

function KNNGame({setScore,onBack}) {
  const pts=[{x:20,y:28,c:"A"},{x:31,y:44,c:"A"},{x:38,y:23,c:"A"},{x:67,y:68,c:"B"},{x:77,y:54,c:"B"},{x:84,y:73,c:"B"}];
  const [p,setP]=useState({x:52,y:48}),[k,setK]=useState(3),[done,setDone]=useState(false);
  const near=[...pts].sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y)).slice(0,k);
  const a=near.filter(x=>x.c==="A").length,b=near.filter(x=>x.c==="B").length,pred=a>=b?"A":"B";
  return <div className="game-screen concept-game"><GameTop label="MISSION 04 / K-NEAREST NEIGHBOR" onBack={onBack}/><div className="game-center-head"><span className="panel-kicker">CLASSIFICATION</span><h4>Move the query point and let its <em>neighbors vote.</em></h4></div>
    <div className="knn-board" onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setP({x:((e.clientX-r.left)/r.width)*100,y:((e.clientY-r.top)/r.height)*100});setDone(false)}}>{pts.map((x,i)=><span key={i} className={"knn-point "+x.c} style={{left:x.x+"%",top:x.y+"%"}}>{x.c}</span>)}{near.map((x,i)=><i key={i} className="knn-ring" style={{left:x.x+"%",top:x.y+"%"}}/>)}<span className="knn-cursor" style={{left:p.x+"%",top:p.y+"%"}}>?</span></div>
    <div className="knn-controls"><label>K <select value={k} onChange={e=>{setK(+e.target.value);setDone(false)}}><option>1</option><option>3</option><option>5</option></select></label><span>VOTES A:{a} / B:{b}</span><button className="again-btn" onClick={()=>{if(!done){setDone(true);setScore(v=>v+130)}}}>{done?"PREDICTED CLASS "+pred+" ✓":"CLASSIFY →"}</button></div>
    <div className="lesson-note"><b>WHAT YOU LEARN:</b> KNN predicts from the labels of the closest <em>training examples</em>.</div></div>;
}

function SQLGame({setScore,onBack}) {
  const qs=[
    ["Find students with Mid_Sem ≥ 70.",["SELECT * FROM students WHERE Mid_Sem >= 70;","SELECT students WHERE Mid_Sem > 70;","GET * FROM students FILTER Mid_Sem >= 70;"]],
    ["Count students per department.",["SELECT department, COUNT(*) FROM students GROUP BY department;","SELECT COUNT(department) FROM students;","SELECT department FROM students COUNT(*);"]],
    ["Top 3 by End_Sem.",["SELECT * FROM students ORDER BY End_Sem DESC LIMIT 3;","SELECT TOP 3 students SORT End_Sem;","SELECT * FROM students WHERE End_Sem TOP 3;"]]
  ];
  const [q,setQ]=useState(0),[pick,setPick]=useState(null),item=qs[q];
  return <div className="game-screen concept-game"><GameTop label={"MISSION 05 / SQL DETECTIVE / QUERY "+(q+1)} onBack={onBack}/><div className="sql-head"><span className="panel-kicker">DATABASE CHALLENGE</span><h4>{item[0]}</h4></div>
    <div className="sql-table"><div className="sql-row header"><span>id</span><span>department</span><span>Mid_Sem</span><span>End_Sem</span></div>{[[1,"AI",82,88],[2,"CS",64,74],[3,"AI",91,93],[4,"DS",69,67]].map(r=><div className="sql-row" key={r[0]}>{r.map((v,j)=><span key={j}>{v}</span>)}</div>)}</div>
    <div className="sql-options">{item[1].map((x,i)=><button key={x} className={pick===i?"sql-picked":""} onClick={()=>{if(pick===null){setPick(i);if(i===0)setScore(v=>v+140)}}}><b>{String.fromCharCode(65+i)}</b><code>{x}</code></button>)}</div>
    {pick!==null&&<div className={"sql-feedback "+(pick===0?"correct":"wrong")}><b>{pick===0?"✓ QUERY CORRECT":"× NOT QUITE"}</b><span>WHERE filters rows; GROUP BY groups rows; ORDER BY + LIMIT controls ranking.</span><button className="again-btn" onClick={()=>{setQ(i=>(i+1)%3);setPick(null)}}>NEXT QUERY →</button></div>}
    <div className="lesson-note"><b>WHAT YOU LEARN:</b> SQL turns questions into precise <em>filter, group and sort</em> operations.</div></div>;
}

function NeuralGame({setScore,onBack}) {
  const [active,setActive]=useState([true,true,true]),[done,setDone]=useState(false);
  const vals=[.24,.67,.91],count=active.filter(Boolean).length;
  return <div className="game-screen concept-game"><GameTop label="MISSION 06 / NEURAL NETWORK BUILDER" onBack={onBack}/><div className="game-center-head"><span className="panel-kicker">INPUT → HIDDEN → OUTPUT</span><h4>Activate neurons and run a tiny <em>forward pass.</em></h4></div>
    <div className="neural-network"><div className="nn-column"><small>INPUT FEATURES</small><span>STUDY</span><span>ATTEND</span><span>PROJECT</span></div><div className="nn-column hidden"><small>HIDDEN LAYER</small>{active.map((x,i)=><button key={i} className={x?"active":""} onClick={()=>{setActive(a=>a.map((v,j)=>j===i?!v:v));setDone(false)}}>h{i+1}<em>{x?vals[i].toFixed(2):"OFF"}</em></button>)}</div><div className="nn-output"><small>OUTPUT</small><b>{done?(count>=2?"HIGH":"LOW"):"?"}</b><span>ACTIVATION</span></div></div>
    <div className="nn-controls"><span>{count}/3 HIDDEN NEURONS ACTIVE</span><button className="again-btn" onClick={()=>{if(!done){setDone(true);setScore(v=>v+160)}}}>{done?"FORWARD PASS COMPLETE ✓":"RUN FORWARD PASS →"}</button></div>
    <div className="lesson-note"><b>WHAT YOU LEARN:</b> Neural networks transform inputs through weighted <em>hidden layers</em> into predictions.</div></div>;
}

function PCAGame({setScore,onBack}) {
  const [angle,setAngle]=useState(25),[done,setDone]=useState(false); const quality=Math.max(0,100-Math.abs(angle-45)*1.65);
  return <div className="game-screen concept-game"><GameTop label="MISSION 07 / PCA COMPRESSOR" onBack={onBack}/><div className="game-center-head"><span className="panel-kicker">DIMENSIONALITY REDUCTION</span><h4>Rotate the axis to capture maximum <em>variance.</em></h4></div>
    <div className="pca-layout"><div className="pca-plot"><div className="pca-axis target"/><div className="pca-axis" style={{transform:"rotate("+angle+"deg)"}}/>{Array.from({length:18},(_,i)=><i key={i} className="pca-dot" style={{left:(14+i*4)+"%",top:(30+Math.sin(i*.75)*14)+"%"}}/>)}</div>
    <div className="pca-readout"><span>PROJECTION ANGLE</span><b>{angle}°</b><input type="range" min="0" max="90" value={angle} onChange={e=>{setAngle(+e.target.value);setDone(false)}}/><small>Target ≈ 45°</small><button className="again-btn" onClick={()=>{if(!done){setDone(true);if(quality>=85)setScore(v=>v+170)}}}>{done?"DATA COMPRESSED ✓":"COMPRESS DATA →"}</button></div></div>
    {done&&<div className={"pca-result "+(quality>=85?"correct":"wrong")}><b>{quality>=85?"HIGH VARIANCE RETAINED":"LOW VARIANCE RETAINED"}</b><span>Projection quality: {quality.toFixed(0)}%. PCA keeps important variance while reducing dimensions.</span></div>}
    <div className="lesson-note"><b>WHAT YOU LEARN:</b> PCA projects data onto directions that preserve as much <em>variance</em> as possible.</div></div>;
}

function DecisionTreeGame({setScore,onBack}) {
  const [split,setSplit]=useState(null);
  const options=[
    {name:"ATTENDANCE",gain:.82,desc:"Strong separation: most high-attendance students reach the target."},
    {name:"PROJECT SCORE",gain:.66,desc:"Useful split, but some classes still overlap."},
    {name:"SCREEN TIME",gain:.31,desc:"Weak split: the groups remain mixed."}
  ];
  const picked=options.find(x=>x.name===split);
  return <div className="game-screen concept-game"><GameTop label="MISSION 08 / DECISION TREE ARCHITECT" onBack={onBack}/>
    <div className="tree-intro"><span className="panel-kicker">GREEDY SPLITTING</span><h4>Choose the feature that makes the next branch <em>most informative.</em></h4><p>A decision tree searches for splits that reduce impurity. Your job: pick the strongest signal.</p></div>
    <div className="tree-stage"><div className="tree-node root">STUDENT<br/><small>?</small></div><div className="tree-branches">{["YES","NO"].map(x=><span key={x}>{x}</span>)}</div>{picked&&<><div className="tree-node child left">{picked.name}<small>HIGH</small></div><div className="tree-node child right">OTHER<small>LOWER MIX</small></div></>}</div>
    <div className="split-options">{options.map(x=><button key={x.name} className={split===x.name?"chosen":""} onClick={()=>{if(!split){setSplit(x.name);if(x.gain>.8)setScore(s=>s+180)}}}><span>{x.name}</span><b>GAIN {x.gain.toFixed(2)}</b></button>)}</div>
    {picked&&<div className={"tree-feedback "+(picked.gain>.8?"correct":"wrong")}><b>{picked.gain>.8?"✓ HIGH INFORMATION GAIN":"△ LOWER INFORMATION GAIN"}</b><span>{picked.desc}</span><button className="again-btn" onClick={()=>setSplit(null)}>TRY ANOTHER SPLIT</button></div>}
    <div className="lesson-note"><b>WHAT YOU LEARN:</b> Decision trees repeatedly choose useful <em>feature splits</em> to make groups more pure and predictions easier.</div>
  </div>;
}

function ClusterGame({setScore,onBack}) {
  const [points,setPoints]=useState([{x:22,y:28},{x:30,y:40},{x:38,y:31},{x:68,y:66},{x:78,y:58},{x:84,y:72},{x:48,y:76},{x:55,y:67}]);
  const [centers,setCenters]=useState([{x:30,y:34},{x:76,y:65}]); const [step,setStep]=useState(0);
  function addPoint(e){const r=e.currentTarget.getBoundingClientRect();setPoints(p=>[...p,{x:((e.clientX-r.left)/r.width)*100,y:((e.clientY-r.top)/r.height)*100}]);}
  function iterate(){
    const groups=centers.map(c=>points.filter(p=>Math.hypot(p.x-c.x,p.y-c.y)<=Math.min(...centers.map(o=>Math.hypot(p.x-o.x,p.y-o.y))+0.01)));
    const next=groups.map((g,i)=>g.length?{x:g.reduce((a,p)=>a+p.x,0)/g.length,y:g.reduce((a,p)=>a+p.y,0)/g.length}:centers[i]);
    setCenters(next);setStep(s=>s+1);if(step===2)setScore(s=>s+190);
  }
  function reset(){setPoints([{x:22,y:28},{x:30,y:40},{x:38,y:31},{x:68,y:66},{x:78,y:58},{x:84,y:72},{x:48,y:76},{x:55,y:67}]);setCenters([{x:30,y:34},{x:76,y:65}]);setStep(0)}
  return <div className="game-screen concept-game"><GameTop label="MISSION 09 / CLUSTER MISSION" onBack={onBack}/>
    <div className="cluster-head"><span className="panel-kicker">UNSUPERVISED LEARNING</span><h4>Discover groups without labels. <em>You choose the centroids.</em></h4><p>Click the board to add data, then run K-means iterations.</p></div>
    <div className="cluster-board" onClick={addPoint}>{points.map((p,i)=><i key={i} className="cluster-point" style={{left:p.x+"%",top:p.y+"%"}}/>)}{centers.map((c,i)=><b key={i} className="cluster-center" style={{left:c.x+"%",top:c.y+"%"}}>C{i+1}</b>)}</div>
    <div className="cluster-controls"><span>ITERATION <b>{step}</b></span><button className="again-btn" onClick={iterate}>RUN K-MEANS STEP →</button><button className="again-btn secondary-game" onClick={reset}>RESET</button></div>
    <div className="lesson-note"><b>WHAT YOU LEARN:</b> K-means alternates between <em>assigning points to the nearest centroid</em> and moving centroids to group averages.</div>
  </div>;
}

function ConfusionMatrixGame({setScore,onBack}) {
  const samples=[
    {actual:"POSITIVE",pred:"POSITIVE",correct:true,label:"Fraud signal"},
    {actual:"POSITIVE",pred:"NEGATIVE",correct:false,label:"Missed fraud"},
    {actual:"NEGATIVE",pred:"POSITIVE",correct:false,label:"False alarm"},
    {actual:"NEGATIVE",pred:"NEGATIVE",correct:true,label:"Normal transaction"},
    {actual:"POSITIVE",pred:"POSITIVE",correct:true,label:"Fraud signal"},
    {actual:"NEGATIVE",pred:"POSITIVE",correct:false,label:"False alarm"}
  ];
  const [i,setI]=useState(0),[chosen,setChosen]=useState(null),[stats,setStats]=useState({tp:0,tn:0,fp:0,fn:0});
  const s=stats,total=s.tp+s.tn+s.fp+s.fn,accuracy=total?((s.tp+s.tn)/total*100):0,precision=(s.tp+s.fp)?(s.tp/(s.tp+s.fp)*100):0,recall=(s.tp+s.fn)?(s.tp/(s.tp+s.fn)*100):0,item=samples[i];
  function predict(p){if(chosen)return;setChosen(p);const actual=item.actual==="POSITIVE";const pred=p==="POSITIVE";setStats(x=>({...x,tp:x.tp+(actual&&pred?1:0),tn:x.tn+(!actual&&!pred?1:0),fp:x.fp+(!actual&&pred?1:0),fn:x.fn+(actual&&!pred?1:0)}));if((p==="POSITIVE")===(item.pred==="POSITIVE"))setScore(v=>v+35)}
  function next(){if(i===samples.length-1){setI(0);setStats({tp:0,tn:0,fp:0,fn:0})}else setI(x=>x+1);setChosen(null)}
  return <div className="game-screen concept-game"><GameTop label={"MISSION 10 / CONFUSION ARENA / SAMPLE "+(i+1)} onBack={onBack}/>
    <div className="matrix-head"><span className="panel-kicker">MODEL EVALUATION</span><h4>Predict this transaction, then watch the <em>confusion matrix</em> change.</h4><div className="sample-chip">{item.label}</div></div>
    <div className="matrix-layout"><div className="prediction-panel"><span>ACTUAL LABEL: <b>{item.actual}</b></span><p>Should the model flag it as positive?</p><div className="class-buttons"><button onClick={()=>predict("POSITIVE")} className={chosen==="POSITIVE"?"picked":""}>POSITIVE</button><button onClick={()=>predict("NEGATIVE")} className={chosen==="NEGATIVE"?"picked":""}>NEGATIVE</button></div>{chosen&&<button className="again-btn" onClick={next}>NEXT SAMPLE →</button>}</div>
    <div className="matrix-card"><div className="matrix-grid"><div/><b>PRED +</b><b>PRED −</b><b>ACT +</b><strong>{s.tp}<small>TP</small></strong><strong>{s.fn}<small>FN</small></strong><b>ACT −</b><strong>{s.fp}<small>FP</small></strong><strong>{s.tn}<small>TN</small></strong></div>
    <div className="metric-row"><span>ACC <b>{accuracy.toFixed(0)}%</b></span><span>PREC <b>{precision.toFixed(0)}%</b></span><span>RECALL <b>{recall.toFixed(0)}%</b></span></div></div></div>
    <div className="lesson-note"><b>WHAT YOU LEARN:</b> Accuracy alone is not enough. <em>Precision</em> measures false alarms; <em>recall</em> measures missed positives.</div>
  </div>;
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

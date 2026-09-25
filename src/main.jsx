import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import * as THREE from "three";
import {
  ArrowUpRight, Bot, Github, Linkedin, Mail, MessageCircle, Phone, Send, Mic as MicIcon,
  Sparkles, Sun, Moon, BrainCircuit, Database, Atom, Code2,
  MousePointer2, ExternalLink, FileText, Upload, Trash2, RotateCcw, Square
} from "lucide-react";
import "./styles.css";

const profile = {
  name: "Tayyab Sayyad",
  role: "MSc AI & Data Science • AI Application Builder",
  tagline: "Building intelligent applications at the intersection of AI, data, and modern technology.",
  github: "https://github.com/tshamshuddinsayyad",
  linkedin: "https://www.linkedin.com/in/tayyab-sayyad-a04079309/",
  whatsapp: "https://wa.me/918007766305",
  email: "tayyabsayyad2005@gmail.com",
  phone: "+91 80077 66305",
  interests: ["Generative AI", "Machine Learning", "Data Science", "Full-Stack Development", "RAG & LLM Applications"]
};

const projects = [
  { title: "University AI Chatbot", text: "A university-focused Generative AI assistant using LangChain, RAG, university documents and Gemini to answer academic questions.", tags: ["LangChain", "RAG", "Gemini"], icon: BrainCircuit, status: "ONGOING" },
  { title: "TAYYAB AI / Interactive Portfolio", text: "An AI-powered portfolio combining React, Three.js, Gemini, responsive UI, voice interaction, document tools and an interactive learning arcade.", tags: ["React", "Three.js", "Gemini"], icon: Atom, status: "ONGOING" },
  { title: "Student Analytics & Data Analysis", text: "Python-based academic data work covering student datasets, descriptive statistics, visualization and extracting useful patterns from data.", tags: ["Python", "Pandas", "Statistics"], icon: Database, status: "ACADEMIC" },
  { title: "AI & Data Science Learning Arcade", text: "Interactive browser-based experiments that make machine learning and data concepts easier to explore through hands-on visual missions.", tags: ["React", "AI / ML", "Interactive"], icon: Sparkles, status: "ONGOING" },
  { title: "Statistical Analysis & Visualization", text: "Academic exercises using datasets, descriptive statistics, box plots, charts and statistical calculations to build practical data-analysis foundations.", tags: ["Python", "Statistics", "Visualization"], icon: Database, status: "ACADEMIC" }
];

const skillGroups = [
  { title: "Programming", items: ["Python", "JavaScript", "C", "C++", "Java", "HTML", "CSS", "SQL"] },
  { title: "AI & Data", items: ["Machine Learning", "Deep Learning", "NLP", "Generative AI", "LLMs", "RAG", "Pandas", "Statistics"] },
  { title: "Frameworks & Web", items: ["React", "Node.js", "Flask / FastAPI", "LangChain", "Three.js", "Vite", "APIs"] },
  { title: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "DBMS", "RDBMS"] },
  { title: "Cloud & Deploy", items: ["AWS", "Vercel", "GitHub Pages", "Deployment"] },
  { title: "Tools & Systems", items: ["Git", "GitHub", "VS Code", "Linux", "Docker", "Jupyter", "Google Colab"] }
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
      const target = e.target.closest?.(".project-card, .skill-group, .learning-cards article, .contact-box, .language-bar, .mini-stats > div, .education-item, .certification-card, .learning-note, .game-cards button, .game-screen, .ai-lab, .model-card");
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
          <p>Eleven interactive missions that turn AI concepts into experiments you can see, control and understand.</p>
        </div>
        <div className="play-score"><span>LEARNING SCORE</span><b>{score.toString().padStart(4,"0")}</b></div>
      </div>

      {!game && (
        <div className="game-select">
          <div className="select-title"><span>CHOOSE YOUR MISSION</span><small>11 CONCEPTS / 11 GAMES</small></div>
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
            <GameCard n="11" icon="⌖" meta="CLASSIFICATION THRESHOLD" title={<>DYNAMIC<br/><em>THRESHOLD</em></>} text="Move the decision threshold and balance precision, recall and F1." action="TUNE" onClick={() => startGame("threshold")} />
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
      {game === "threshold" && <DynamicThresholdTool setScore={setScore} onBack={back} />}

      <div className="playground-footer"><span>EXPERIMENT → LEARN → PREDICT → EXPLAIN</span><b>AI LAB ONLINE</b></div>
    </div>
  );
}

function DynamicThresholdTool({setScore,onBack}) {
  const samples=[
    {score:.96,label:1},{score:.91,label:1},{score:.84,label:1},{score:.78,label:1},
    {score:.72,label:0},{score:.63,label:1},{score:.57,label:0},{score:.49,label:0},
    {score:.38,label:0},{score:.26,label:0},{score:.18,label:0},{score:.08,label:0}
  ];
  const [threshold,setThreshold]=useState(.50),[done,setDone]=useState(false);
  const predicted=samples.map(s=>({...s,pred:s.score>=threshold?1:0}));
  const tp=predicted.filter(s=>s.pred===1&&s.label===1).length;
  const tn=predicted.filter(s=>s.pred===0&&s.label===0).length;
  const fp=predicted.filter(s=>s.pred===1&&s.label===0).length;
  const fn=predicted.filter(s=>s.pred===0&&s.label===1).length;
  const precision=tp+fp?tp/(tp+fp):0;
  const recall=tp+fn?tp/(tp+fn):0;
  const f1=precision+recall?2*precision*recall/(precision+recall):0;
  function tune(){
    if(done)return;
    setDone(true);
    setScore(s=>s+200);
  }
  return <div className="game-screen concept-game threshold-game">
    <GameTop label="MISSION 11 / DYNAMIC THRESHOLD" onBack={onBack}/>
    <div className="game-center-head">
      <span className="panel-kicker">CLASSIFICATION CONTROL</span>
      <h4>Move the threshold and watch the <em>decision boundary</em> change.</h4>
      <p>A higher threshold usually makes positive predictions harder, changing precision and recall.</p>
    </div>
    <div className="threshold-layout">
      <div className="threshold-chart">
        <div className="threshold-zone positive">PREDICT POSITIVE</div>
        <div className="threshold-zone negative">PREDICT NEGATIVE</div>
        <div className="threshold-axis"><span>0.0</span><span>MODEL SCORE</span><span>1.0</span></div>
        {predicted.map((s,i)=><i key={i} className={"threshold-point "+(s.label?"actual-positive":"actual-negative")+" "+(s.pred===s.label?"correct":"incorrect")} style={{left:(s.score*100)+"%"}} title={"Score "+s.score}/>)}
        <div className="threshold-marker" style={{left:(threshold*100)+"%"}}><b>{threshold.toFixed(2)}</b></div>
      </div>
      <div className="threshold-controls">
        <div className="threshold-readout"><span>DECISION THRESHOLD</span><b>{threshold.toFixed(2)}</b></div>
        <input aria-label="Decision threshold" type="range" min="0.05" max="0.95" step="0.01" value={threshold} onChange={e=>{setThreshold(+e.target.value);setDone(false)}}/>
        <div className="threshold-hints"><small>MORE RECALL</small><small>MORE PRECISION</small></div>
        <button className="again-btn" onClick={tune}>{done?"THRESHOLD ANALYZED ✓":"ANALYZE THIS THRESHOLD →"}</button>
      </div>
    </div>
    <div className="threshold-metrics">
      <div><span>TP</span><b>{tp}</b></div><div><span>FP</span><b>{fp}</b></div><div><span>FN</span><b>{fn}</b></div><div><span>TN</span><b>{tn}</b></div>
      <div><span>PRECISION</span><b>{(precision*100).toFixed(0)}%</b></div><div><span>RECALL</span><b>{(recall*100).toFixed(0)}%</b></div><div><span>F1</span><b>{(f1*100).toFixed(0)}%</b></div>
    </div>
    <div className="lesson-note"><b>WHAT YOU LEARN:</b> A classification model outputs a score; the <em>threshold</em> converts that score into a positive or negative decision. Moving it changes the precision–recall trade-off.</div>
  </div>;
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
  const STORAGE_KEY = "tayyab-ai-conversation-v6";
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [webSearch, setWebSearch] = useState(true);
  const [mode, setMode] = useState("auto");
  const [documentText, setDocumentText] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showComposerMenu, setShowComposerMenu] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const recognitionRef = useRef(null);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (Array.isArray(saved) && saved.length) return saved;
    } catch {}
    return [{
      role: "assistant",
      content: "Hi! I’m Tayyab AI. I can help with Tayyab’s portfolio, coding, AI/ML, study topics, research and your uploaded documents."
    }];
  });
  const abortRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = event => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += chunk;
        else interimText += chunk;
      }
      if (finalText) setInput(v => (v ? v + " " : "") + finalText.trim());
      else if (interimText) setInput(v => v.replace(/\s*\[listening…\]$/, "") + " " + interimText.trim() + " [listening…]");
    };
    recognitionRef.current = recognition;
    return () => { try { recognition.abort(); } catch {} };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
  }, [messages]);

  useEffect(() => {
    return () => {
      try { window.speechSynthesis?.cancel(); } catch {}
    };
  }, []);

  function speakAnswer(text) {
    if (!text || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[#*_`]/g, ""));
      utterance.lang = "en-IN";
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } catch {}
  }

  const modes = [
    ["auto","AUTO"],
    ["study","STUDY"],
    ["coding","CODING"],
    ["research","RESEARCH"],
    ["portfolio","TAYYAB"],
    ["document","DOCS"]
  ];

  const prompts = [
    "Who is Tayyab?",
    "Explain RAG step by step",
    "Debug this Python code",
    "Analyze my document"
  ];

  async function extractFile(file) {
    if (!file) return;
    setUploading(true);
    try {
      const name = file.name.toLowerCase();
      let text = "";
      if (name.endsWith(".txt") || name.endsWith(".md") || name.endsWith(".csv") || name.endsWith(".json")) {
        text = await file.text();
      } else if (name.endsWith(".pdf")) {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.mjs", import.meta.url).toString();
        const data = new Uint8Array(await file.arrayBuffer());
        const pdf = await pdfjs.getDocument({ data }).promise;
        const pages = [];
        for (let i = 1; i <= Math.min(pdf.numPages, 30); i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          pages.push("PAGE " + i + "\n" + content.items.map(x => x.str).join(" "));
        }
        text = pages.join("\n\n");
      } else if (name.endsWith(".docx")) {
        const mammoth = await import("mammoth/mammoth.browser");
        const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        text = result.value;
      } else {
        throw new Error("Supported files: PDF, DOCX, TXT, MD, CSV and JSON.");
      }
      text = text.replace(/\s+\n/g,"\n").trim().slice(0,120000);
      if (!text) throw new Error("No readable text was found in that file.");
      setDocumentText(text);
      setDocumentName(file.name);
      setMode("document");
    } catch (e) {
      setMessages(m => [...m, { role:"assistant", content:"Document upload failed: " + (e.message || "Could not read the file.") }]);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function toggleVoiceInput() {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setMessages(m => [...m, {role:"assistant", content:"Voice input is not supported by this browser. Try Chrome or Edge and allow microphone access."}]);
      return;
    }
    if (listening) { recognition.stop(); return; }
    try { recognition.start(); } catch {}
  }

  function clearChat() {
    abortRef.current?.abort();
    setBusy(false);
    setMessages([{
      role: "assistant",
      content: "New conversation ready. I’m Tayyab AI — ask me anything."
    }]);
  }

  async function send(text = input, options = {}) {
    const q = text.trim();
    if (!q || busy) return;

    try { window.speechSynthesis?.cancel(); } catch {}
    setMessages(m => [...m, { role:"user", content:q }]);
    setInput("");
    setBusy(true);
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{"Content-Type":"application/json","Accept":"application/json"},
        signal:abortRef.current.signal,
        body:JSON.stringify({
          message:q,
          // History is intentionally not sent. Each request is isolated.
          useWebSearch:webSearch,
          mode,
          documentText: mode === "document" ? documentText : "",
          documentName
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.answer || "AI request failed");

      const answer = typeof data.answer === "string"
        ? data.answer.trim()
        : "";

      if (!answer) throw new Error("The AI returned an empty response.");

      const cleanedAnswer = answer
        .replace(/^\\+(?=#+\\s)/gm, "")
        .replace(/\\\\(?=#+\\s)/g, "");

      setMessages(m => [
        ...m,
        {
          role:"assistant",
          content:cleanedAnswer,
          sources:Array.isArray(data.sources) ? data.sources : []
        }
      ]);

      if (voiceMode || options.speak) speakAnswer(cleanedAnswer);
    } catch (e) {
      if (e.name !== "AbortError") {
        setMessages(m => [...m, {
          role:"assistant",
          content:e.message || "The AI service is unavailable."
        }]);
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  function regenerate(messageIndex) {
    if (busy) return;
    const lastUser = [...messages]
      .slice(0, Math.max(0, messageIndex ?? messages.length))
      .reverse()
      .find(m => m.role === "user");
    if (!lastUser) return;

    const lastAssistantIndex = [...messages]
      .slice(0, messageIndex ?? messages.length)
      .map(m => m.role)
      .lastIndexOf("assistant");

    if (lastAssistantIndex >= 0) {
      setMessages(m => m.filter((_, index) => index !== lastAssistantIndex));
    }

    setTimeout(() => send(lastUser.content), 0);
  }

  return <>
    <button className="chat-fab" onClick={() => setOpen(v => !v)}>
      <Bot size={18}/><span>Ask Tayyab AI</span><i/>
    </button>
    {open && <section className="chat-panel">
      <div className="chat-head">
        <div>
          <b><Sparkles size={14}/> TAYYAB AI <span className="ai-live-dot"/></b>
          <small>Personal AI • RAG • Web • Coding • Study</small>
        </div>
        <div className="chat-head-actions">
          <button onClick={clearChat} title="New chat"><Trash2 size={13}/></button>
          <button className={webSearch ? "search-toggle active" : "search-toggle"} onClick={() => setWebSearch(v => !v)}>{webSearch ? "WEB ON" : "WEB OFF"}</button>
          <button onClick={() => setOpen(false)}>×</button>
        </div>
      </div>

      <div className="ai-modebar">
        {modes.map(([value,label]) => <button key={value} className={mode===value?"active":""} onClick={()=>setMode(value)}>{label}</button>)}
      </div>

      {documentName && <div className="document-chip"><FileText size={12}/><span>{documentName}</span><button onClick={()=>{setDocumentText("");setDocumentName("");setMode("auto")}}>×</button></div>}

      <div className="quick-prompts">{prompts.map(p => <button key={p} onClick={() => send(p)}>{p}</button>)}</div>

      <div className="chat-body">
        {messages.map((m,i) => <div key={i} className={"chat-message " + m.role}>
          <div className={"bubble " + m.role}>{m.content || (busy && i===messages.length-1 ? "Thinking…" : "")}</div>
          {m.sources?.length > 0 && <div className="sources"><span>SOURCES</span>{m.sources.map((s,j)=><a key={s.url+j} href={s.url} target="_blank" rel="noreferrer">{j+1}. {s.title}</a>)}</div>}
          {m.role==="assistant" && m.content && <div className="message-actions"><button onClick={()=>navigator.clipboard?.writeText(m.content)}>COPY</button><button onClick={()=>speakAnswer(m.content)} title="Read this answer aloud">🔊 SPEAK</button>{i===messages.length-1 && !busy && <button onClick={()=>regenerate(i)}><RotateCcw size={11}/> REGENERATE</button>}</div>}
        </div>)}
      </div>

      <div className={"chat-composer " + (listening ? "is-listening" : "")}>
        <div className="composer-row">
          <div className="composer-plus-wrap">
            <button className="composer-plus" onClick={()=>setShowComposerMenu(v=>!v)} aria-label="Open tools">+</button>
            {showComposerMenu && <div className="composer-menu">
              <button onClick={()=>{fileRef.current?.click();setShowComposerMenu(false)}}><Upload size={15}/><span><b>Upload files</b><small>PDF, DOCX, TXT, CSV, JSON</small></span></button>
              <button onClick={()=>{setMode("study");setShowComposerMenu(false)}}><Sparkles size={15}/><span><b>Study mode</b><small>Learn with step-by-step explanations</small></span></button>
              <button onClick={()=>{setMode("coding");setShowComposerMenu(false)}}><Code2 size={15}/><span><b>Coding mode</b><small>Debug and build code</small></span></button>
              <button onClick={()=>{setMode("research");setShowComposerMenu(false)}}><ExternalLink size={15}/><span><b>Research mode</b><small>Search the web with sources</small></span></button>
              <button onClick={()=>{setVoiceMode(v=>{const next=!v;if(!next){try{window.speechSynthesis?.cancel()}catch{}}return next});setShowComposerMenu(false)}}><Bot size={15}/><span><b>{voiceMode?"Disable":"Enable"} voice replies</b><small>{voiceMode?"AI answers can be read aloud":"Use browser speech for answers"}</small></span></button>
            </div>}
          </div>
          <textarea
            rows="1"
            value={input.replace(/\s*\[listening…\]$/,"")}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}}
            placeholder={mode==="document"&&documentName?"Ask about your document…":"Message Tayyab AI…"}
          />
          <button className={"composer-mic "+(listening?"active":"")} onClick={toggleVoiceInput} aria-label={listening?"Stop voice input":"Voice input"}>
            <MicIcon size={17}/>
          </button>
          <button className="composer-send" onClick={() => busy ? abortRef.current?.abort() : send()} aria-label={busy?"Stop generation":"Send message"}>
            {busy ? <Square size={15}/> : <Send size={16}/>}
          </button>
        </div>
        <div className="composer-meta"><span>{listening?"Listening… speak now":voiceMode?"Voice replies enabled":"Tayyab AI can make mistakes. Check important information."}</span><span>ENTER ↵</span></div>
      </div>
      <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.md,.csv,.json" hidden onChange={e=>extractFile(e.target.files?.[0])}/>
    </section>}
  </>;
}
function InterestTyping() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = profile.interests[index];
    const delay = deleting ? 42 : 78;
    const timer = setTimeout(() => {
      if (!deleting && text.length < word.length) {
        setText(word.slice(0, text.length + 1));
      } else if (!deleting && text.length === word.length) {
        setDeleting(true);
      } else if (deleting && text.length > 0) {
        setText(word.slice(0, text.length - 1));
      } else {
        setDeleting(false);
        setIndex(i => (i + 1) % profile.interests.length);
      }
    }, (!deleting && text.length === word.length) ? 1500 : delay);
    return () => clearTimeout(timer);
  }, [index, text, deleting]);

  return <span className="typing-interest"><span className="typing-interest-text">{text || "\u00a0"}</span><i className="typing-cursor" aria-hidden="true" /></span>;
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);

  function updateField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
    if (status.type) setStatus({ type: "", text: "" });
  }

  async function submit(e) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setStatus({ type: "", text: "" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.message || "Could not send the message.");
      setForm({ name: "", email: "", subject: "", message: "", website: "" });
      setStatus({ type: "success", text: "Message sent. I'll get back to you soon." });
    } catch (error) {
      setStatus({ type: "error", text: error.message || "Could not send the message. Please try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="contact-message-wrap">
      <div className="contact-form-head">
        <span>SEND ME A MESSAGE</span>
        <small>Messages are delivered to my Telegram.</small>
      </div>
      <form className="contact-form" onSubmit={submit}>
        <input aria-label="Your name" value={form.name} onChange={e => updateField("name", e.target.value)} placeholder="Your name" maxLength={80} required />
        <input aria-label="Your email" type="email" value={form.email} onChange={e => updateField("email", e.target.value)} placeholder="Your email" maxLength={160} required />
        <input aria-label="Subject" value={form.subject} onChange={e => updateField("subject", e.target.value)} placeholder="Subject" maxLength={120} required />
        <textarea aria-label="Your message" value={form.message} onChange={e => updateField("message", e.target.value)} placeholder="Write your message..." maxLength={3000} rows={6} required />
        <input className="contact-honeypot" aria-hidden="true" tabIndex="-1" autoComplete="off" value={form.website} onChange={e => updateField("website", e.target.value)} />
        <div className="contact-form-bottom">
          <small>I'll receive your message on Telegram and can contact you directly.</small>
          <button type="submit" disabled={sending}><Send size={15}/> {sending ? "SENDING..." : "SEND MESSAGE"}</button>
        </div>
        {status.text && <div className={"contact-form-status " + status.type} role="status">{status.text}</div>}
      </form>
    </div>
  );
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
      <div className="navlinks"><a href="#about">About</a><a href="#work">Work</a><a href="#flagship">AI Chatbot</a><a href="#skills">Skills</a><a href="#education">Education</a><a href="#certifications">Certifications</a><a href="#contact">Contact</a></div>
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
          <p>{profile.tagline} I’m Tayyab Sayyad, an MSc Artificial Intelligence & Data Science student at Indira University, Pune, focused on <InterestTyping/>.</p>
          <div className="hero-actions"><a className="primary" href="#work">Explore my work <ArrowUpRight size={17}/></a><a className="secondary" href="#contact">Let's connect <MessageCircle size={17}/></a></div>
          <div className="scroll-hint"><MousePointer2 size={14}/> Explore the model, data and systems I build</div>
        </div>
        <AILab/>
    </section>

      <section className="section intro">
        <div className="section-label">01 — UNDERSTAND</div>
        <div className="intro-grid">
          <h2>Building ideas into<br/><em>intelligent systems.</em></h2>
          <div><p>I’m Tayyab Shamshuddin Sayyad, an MSc Artificial Intelligence & Data Science student at Indira University, Pune. I’m interested in Generative AI, Machine Learning, Data Science, full-stack development and RAG/LLM applications, with a focus on learning by building practical applications.</p><div className="mini-stats"><div><b>AI / ML</b><span>Intelligent systems</span></div><div><b>DATA</b><span>Analytics & statistics</span></div><div><b>WEB</b><span>Modern applications</span></div></div></div>
        </div>
      </section>


      <section className="section work" id="work">
        <div className="section-label">02 — ENGINEER</div>
        <div className="section-heading"><h2>Selected <em>missions.</em></h2><span>Projects, experiments & academic work</span></div>
        <div className="project-grid">{projects.map((p,i) => { const Icon=p.icon; return <article className="project-card" key={p.title}>
          <div className="project-number">{String(i+1).padStart(2,"0")}</div><div className="project-icon"><Icon size={22}/></div><span className="project-type">PROJECT / {String(i+1).padStart(2,"0")} · {p.status}</span>
          <h3>{p.title}</h3><p>{p.text}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub profile <ExternalLink size={14}/></a>
          <div className="project-hover"><span>BUILD</span><b>→</b></div>
        </article>})}</div>
      </section>

      <section className="section flagship" id="flagship">
        <div className="section-label">03 — FLAGSHIP PROJECT</div>
        <div className="flagship-head">
          <div>
            <span className="flagship-kicker">GENERATIVE AI / RAG / FULL-STACK</span>
            <h2>University AI <em>Chatbot.</em></h2>
          </div>
          <span className="flagship-status">ONGOING BUILD</span>
        </div>
        <p className="flagship-lead">A university-focused AI assistant designed to help students access academic information through natural-language questions and university-provided documents.</p>
        <div className="flagship-grid">
          <div className="flagship-panel">
            <span>THE PROBLEM</span>
            <h3>Make academic information easier to access.</h3>
            <p>University information can be spread across PDFs, notices and academic resources. The project explores a conversational interface that can retrieve relevant information before generating an answer.</p>
          </div>
          <div className="flagship-panel">
            <span>THE APPROACH</span>
            <h3>Documents → Retrieval → AI response.</h3>
            <div className="flagship-flow"><b>DOCUMENTS</b><i>→</i><b>CHUNKING</b><i>→</i><b>RAG</b><i>→</i><b>GEMINI</b></div>
            <p>Built around LangChain and a retrieval-augmented generation workflow, with a React web interface and Python-based AI application development.</p>
          </div>
        </div>
        <div className="flagship-features">
          <div><span>CURRENT</span><b>LangChain + RAG</b><small>University document workflow</small></div>
          <div><span>CURRENT</span><b>Gemini integration</b><small>LLM-powered responses</small></div>
          <div><span>CURRENT</span><b>Web interface</b><small>Conversational student experience</small></div>
          <div><span>PLANNED</span><b>Source citations</b><small>Make retrieved evidence visible</small></div>
          <div><span>PLANNED</span><b>Authentication</b><small>Student and admin access</small></div>
          <div><span>PLANNED</span><b>Cloud deployment</b><small>Production-ready infrastructure</small></div>
        </div>
        <div className="flagship-tech"><span>PYTHON</span><span>LANGCHAIN</span><span>RAG</span><span>GEMINI</span><span>REACT</span><span>POSTGRESQL</span></div>
      </section>

      <section className="section systems">
        <div className="section-label">04 — MODEL</div>
        <h2>A toolkit for <em>building intelligence.</em></h2>
        <div className="skill-grid">{skillGroups.map(g => <div className="skill-group" key={g.title}><span className="group-title">{g.title}</span>{g.items.map((s,i)=><div className="skill-row" key={s}><small>0{i+1}</small><b>{s}</b><span>↗</span></div>)}</div>)}</div>
        <LiveModelLab/>
      </section>

      <section className="section language-section" id="skills">
        <div className="section-label">05 — TECHNICAL STACK</div>
        <div className="language-layout"><div><h2>Tools I <em>build with.</em></h2><p>My current toolkit spans programming, AI, data, databases, cloud deployment and modern web development.</p></div><div className="language-bars">{[["Python","AI • Data Science • Automation","PRIMARY"],["JavaScript","React • Web • Interactive UI","CORE"],["SQL","Databases • Analytics","CORE"],["LangChain","RAG • LLM applications","CORE"],["PostgreSQL","Relational data • Projects","CORE"],["Git / GitHub","Version control • Collaboration","CORE"]].map(x=><div className="language-bar" key={x[0]}><div><b>{x[0]}</b><span>{x[1]}</span><i>{x[2]}</i></div><u><span style={{width:x[2]==="PRIMARY"?"92%":"78%"}}/></u></div>)}</div></div>
      </section>

      <section className="section learning">
        <div className="section-label">06 — LEARNING JOURNEY</div>
        <div className="learning-grid"><div><h2>Learning by <em>building.</em></h2><p>I’m continuously developing my foundation in Artificial Intelligence & Data Science through projects, experimentation and hands-on technical work.</p></div><div className="learning-cards"><article><Atom/><b>Generative AI</b><span>LLMs, RAG, LangChain and AI assistants</span></article><article><Database/><b>Data Science</b><span>Python, Pandas, statistics and analytics</span></article><article><Code2/><b>Full-Stack Development</b><span>React, JavaScript, APIs and databases</span></article></div></div>
      </section>

      <section className="section education" id="education">
        <div className="section-label">07 — EDUCATION</div>
        <div className="intro-grid"><h2>Academic <em>foundation.</em></h2><div>
          <p>My academic journey has progressed from computer science fundamentals into Artificial Intelligence & Data Science, with a focus on building practical technology projects.</p>
          <div className="education-timeline">
            <div className="education-item"><span className="education-node" /><span>10TH • 2020–21</span><b>Shri Sainath Highschool</b><small>87%</small><em>School foundation</em></div>
            <div className="education-item"><span className="education-node" /><span>12TH • 2022–23</span><b>Creative Public School</b><small>55.17%</small><em>Higher secondary</em></div>
            <div className="education-item"><span className="education-node" /><span>BSc CS • 2025–26</span><b>Indira College of Commerce and Science</b><small>CGPA 9.72</small><em>Computer Science</em></div>
            <div className="education-item active"><span className="education-node" /><span>MSc AIDS • 2027–28</span><b>Indira College of Commerce and Science</b><small>Currently pursuing • 1st Semester • Expected graduation 2027–28</small><em>Artificial Intelligence & Data Science • Current</em></div>
          </div>
        </div></div>
      </section>

      <section className="section certifications" id="certifications">
        <div className="section-label">08 — CERTIFICATIONS</div>
        <div className="section-heading"><h2>Completed <em>credentials.</em></h2><span>Verified learning milestones</span></div>
        <div className="certification-grid">
          <article className="certification-card"><span className="cert-index">01</span><span className="cert-platform">UDEMY • COMPLETED</span><h3>Mastering Data Structures & Algorithms using C and C++</h3><p>Completed certification covering data structures and algorithmic problem-solving with C and C++.</p><div className="cert-badge">COMPLETED ✓</div></article>
          <article className="certification-card"><span className="cert-index">02</span><span className="cert-platform">REDMAGIC / INFOSYS • COMPLETED</span><h3>RedMagic / Infosys Certification Course</h3><p>Completed certification course as part of my technical learning journey.</p><div className="cert-badge">COMPLETED ✓</div></article>
        </div>
        <div className="learning-note"><span>CURRENTLY LEARNING</span><b>Ongoing MSc AI & Data Science + hands-on Generative AI, RAG, Machine Learning and full-stack development.</b></div>
      </section>

      <section className="section contact" id="contact">
        <div className="contact-box">
          <div className="section-label">09 — CONNECT</div>
          <h2>Have an idea?<br/><em>Let's build it.</em></h2>
          <p>AI, data, web development or an interesting experiment — I'm always open to meaningful projects and conversations.</p>
          <div className="contact-actions"><a className="primary" href={profile.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17}/> WhatsApp</a><a className="secondary" href={"mailto:"+profile.email}><Mail size={17}/> Email</a><a className="secondary" href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17}/> LinkedIn</a></div><div className="contact-phone"><Phone size={15}/><span>Mobile</span><a href={"tel:"+profile.phone.replace(/\s/g,"")}>{profile.phone}</a></div>
          <ContactForm />
        </div>
      </section>
    </main>

    <footer><span>© {new Date().getFullYear()} {profile.name}</span><span>DATA → MODELS → INTELLIGENCE</span></footer>
    <Chatbot/>
  </div>;
}

createRoot(document.getElementById("root")).render(<App />);

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';

// NEO-Brutalist Result Modal Component
const AuditModal = ({ review, onClose }) => (
  <div className="fixed inset-0 bg-raw-black/90 z-50 flex items-center justify-center p-4">
    <div className={`brutal-border brutal-shadow w-full max-w-2xl p-6 md:p-10 relative animate-in zoom-in-95 duration-200 ${
      review.status === 'Passed' ? 'bg-brand-cream' : 'bg-red-500 animate-pulse'
    }`}>
      
      {/* Result Status Stamp */}
      <div className={`absolute -top-8 -right-4 brutal-border px-6 py-4 text-3xl md:text-5xl font-black rotate-12 z-10 transition-transform hover:scale-110 ${
        review.status === 'Passed' ? 'bg-green-400 text-raw-black' : 'bg-raw-black text-white'
      }`}>
        {review.status.toUpperCase()}!
      </div>

      <h2 className={`text-4xl md:text-6xl font-black mb-6 underline decoration-8 tracking-tighter uppercase ${
          review.status === 'Passed' ? 'decoration-brand-orange text-raw-black' : 'decoration-white text-white'
      }`}>
        {review.status === 'Passed' ? 'ARCHITECT_REPORT' : 'SYSTEM_FAILURE'}
      </h2>

      <div className={`brutal-border p-4 mb-8 ${review.status === 'Passed' ? 'bg-white' : 'bg-raw-black text-white'}`}>
        <p className="text-xl md:text-2xl font-bold italic">
          "{review.summary}"
        </p>
        <div className="mt-4 flex items-center gap-4">
            <span className="font-black text-2xl">FINAL_SCORE:</span>
            <span className={`text-4xl font-black ${review.status === 'Passed' ? 'text-brand-orange' : 'text-green-400'}`}>
                {review.score}/100
            </span>
        </div>
      </div>
      
      <div className="space-y-4 max-h-[35vh] overflow-y-auto mb-8 pr-2 brutal-scrollbar">
        {review.feedback && review.feedback.map((item, i) => (
          <div key={i} className={`brutal-border p-4 brutal-shadow-hover transition-all ${
              review.status === 'Passed' ? 'bg-white' : 'bg-slate-900 border-white'
          }`}>
            <span className={`${review.status === 'Passed' ? 'bg-brand-night text-white' : 'bg-white text-raw-black'} px-2 font-black uppercase text-xs inline-block`}>
                {item.type}
            </span>
            <p className={`font-bold text-lg mt-2 leading-tight ${review.status === 'Passed' ? 'text-raw-black' : 'text-white'}`}>
                ISSUE: {item.msg}
            </p>
            <p className={`${review.status === 'Passed' ? 'text-brand-orange' : 'text-green-400'} font-black mt-2 uppercase text-sm italic border-t-2 ${review.status === 'Passed' ? 'border-raw-black' : 'border-white'} pt-2`}>
                FIX: {item.fix}
            </p>
          </div>
        ))}
      </div>

      <button 
        onClick={onClose}
        className={`w-full brutal-border font-black py-4 text-2xl brutal-shadow brutal-shadow-hover active:translate-y-1 transition-all ${
            review.status === 'Passed' ? 'bg-brand-night text-white' : 'bg-white text-raw-black'
        }`}
      >
        {review.status === 'Passed' ? 'ACKNOWLEDGE_&_CLOSE_DISK' : 'RETRY_INIT_SEQUENCE'}
      </button>
    </div>
  </div>
);

const EditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sprint, setSprint] = useState(null);
  const [user, setUser] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [review, setReview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sprintRes, userRes] = await Promise.all([
            axios.get(`http://localhost:5000/api/sprints/${id}`),
            axios.get(`http://localhost:5000/api/user/demo`)
        ]);
        setSprint(sprintRes.data);
        setUser(userRes.data);
        setUserCode(sprintRes.data.starterCode);
      } catch (err) {
        console.error("Error fetching data");
        navigate('/');
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleAudit = useCallback(async () => {
    if (!userCode || isAnalyzing) return;
    
    setIsAnalyzing(true);
    setReview(null);
    try {
      const { data } = await axios.post('http://localhost:5000/api/review', {
        userCode,
        sprintTitle: sprint.title,
        constraints: sprint.constraints,
        userId: user?._id // Pass user ID for XP update
      });
      setReview(data);
    } catch (err) {
      alert("CRITICAL ERROR: AI_NODE_OFFLINE");
    }
    setIsAnalyzing(false);
  }, [userCode, isAnalyzing, sprint, user]);

  if (!sprint) return (
    <div className="bg-brand-night h-screen p-10 font-black text-brand-cream text-3xl md:text-5xl italic animate-pulse flex items-center justify-center">
      LOADING_SUBSYSTEMS...
    </div>
  );

  return (
    <div className="min-h-screen md:h-screen bg-brand-cream flex flex-col border-[6px] md:border-[10px] border-raw-black overflow-x-hidden">
      
      {/* Result Modal Overlay */}
      {review && <AuditModal review={review} onClose={() => setReview(null)} />}

      {/* 1. TOP NAV BAR */}
      <nav className="border-b-[4px] md:border-b-[6px] border-raw-black bg-brand-orange p-3 md:p-4 flex flex-col sm:flex-row justify-between items-center gap-4 z-20">
        <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <button 
            onClick={() => navigate('/')}
            className="brutal-border bg-raw-white px-3 md:px-4 py-1.5 md:py-2 font-black text-sm md:text-base brutal-shadow-hover transition-all text-raw-black"
          >
            ← BACK
          </button>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-raw-black uppercase tracking-tighter truncate max-w-[200px] md:max-w-md">
            {sprint.title}
          </h1>
        </div>
        
        <div className="flex gap-2 md:gap-4 w-full sm:w-auto">
          <div className="hidden lg:block font-mono font-bold bg-brand-night text-brand-cream px-4 py-2 brutal-border text-sm">
            STATUS: [ {isAnalyzing ? "AUDITING" : "STABLE"} ]
          </div>
          <button 
            onClick={handleAudit}
            disabled={isAnalyzing}
            className="flex-1 sm:flex-none brutal-border bg-green-400 px-4 md:px-8 py-2 font-black text-lg md:text-xl brutal-shadow brutal-shadow-hover active:shadow-none transition-all disabled:opacity-50 text-raw-black"
          >
            {isAnalyzing ? "AUDITING..." : "SUBMIT_FOR_AUDIT"}
          </button>
        </div>
      </nav>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <aside className="w-full md:w-[40%] lg:w-1/3 bg-brand-cream border-b-[6px] md:border-b-0 md:border-r-[6px] border-raw-black p-6 md:p-8 overflow-y-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-4 md:mb-6 underline decoration-4 md:decoration-8 decoration-brand-orange text-raw-black">MISSION_DETAILS</h2>
          <p className="text-base md:text-lg font-bold text-brand-night mb-6 md:mb-8 leading-tight">
            {sprint.description}
          </p>

          <div className="bg-raw-white brutal-border p-4 md:p-6 brutal-shadow mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-black mb-4 uppercase bg-brand-night text-white inline-block px-2 italic">Protocols:</h3>
            <ul className="space-y-3 md:space-y-4">
              {sprint.constraints.map((c, i) => (
                <li key={i} className="flex items-start gap-2 md:gap-3 font-bold text-brand-night text-sm md:text-base">
                  <span className="bg-brand-orange text-white px-1 text-xs mt-1 shrink-0">#{i+1}</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-4 border-dashed border-raw-black p-4 bg-yellow-200">
            <span className="font-black uppercase">Terminal Alert:</span> 
            <p className="text-sm font-bold mt-1">AI review is active. Logic errors will be stamped as FAILED.</p>
          </div>
        </aside>

        {/* RIGHT PANEL */}
        <main className="w-full md:w-[60%] lg:w-2/3 bg-brand-night p-4 md:p-6 relative flex flex-col min-h-[450px] md:min-h-0">
          <div className="hidden sm:block absolute top-0 right-10 bg-brand-orange text-white px-4 py-1 z-10 font-black brutal-border translate-y-[-50%]">
            NEO_EDITOR_V1.1
          </div>
          
          <div className="flex-grow brutal-border brutal-shadow bg-raw-black overflow-hidden h-full">
            <Editor
              height="100%"
              theme="vs-dark"
              defaultLanguage="javascript"
              value={userCode}
              onChange={(val) => setUserCode(val)}
              options={{
                fontSize: 16,
                fontFamily: 'JetBrains Mono, monospace',
                minimap: { enabled: false },
                padding: { top: 20 },
                lineNumbersMinChars: 3,
                fontWeight: "bold",
                wordWrap: "on",
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditorPage;

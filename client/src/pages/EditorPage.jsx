import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const EditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sprint, setSprint] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [review, setReview] = useState(null);

  useEffect(() => {
    const fetchSprint = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/sprints/${id}`);
        setSprint(data);
        setUserCode(data.starterCode);
      } catch (err) {
        console.error("Error fetching sprint details");
        navigate('/');
      }
    };
    fetchSprint();
  }, [id, navigate]);

  // Optimization: Callback for submission to avoid re-renders
  const handleSubmit = useCallback(async () => {
    if (!userCode || isAnalyzing) return;
    
    setIsAnalyzing(true);
    setReview(null);
    try {
      const { data } = await axios.post('http://localhost:5000/api/review', {
        userCode,
        sprintTitle: sprint.title,
        constraints: sprint.constraints
      });
      setReview(data);
    } catch (err) {
      alert("Review failed. Ensure server is running.");
    }
    setIsAnalyzing(false);
  }, [userCode, isAnalyzing, sprint]);

  if (!sprint) return (
    <div className="bg-brand-night h-screen p-10 font-black text-brand-cream text-3xl md:text-5xl italic animate-pulse flex items-center justify-center">
      LOADING_SUBSYSTEMS...
    </div>
  );

  return (
    <div className="min-h-screen md:h-screen bg-brand-cream flex flex-col border-[6px] md:border-[10px] border-raw-black overflow-x-hidden">
      
      {/* 1. TOP NAV BAR: Responsive Flex */}
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
            onClick={handleSubmit}
            disabled={isAnalyzing}
            className="flex-1 sm:flex-none brutal-border bg-green-400 px-4 md:px-8 py-2 font-black text-lg md:text-xl brutal-shadow brutal-shadow-hover active:shadow-none transition-all disabled:opacity-50 text-raw-black"
          >
            {isAnalyzing ? "AUDITING..." : "EXECUTE_AUDIT"}
          </button>
        </div>
      </nav>

      {/* 2. MAIN WORKSPACE: Stacks on mobile */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        
        {/* LEFT PANEL: The Dossier (Instructions) */}
        <aside className="w-full md:w-[40%] lg:w-1/3 bg-brand-cream border-b-[6px] md:border-b-0 md:border-r-[6px] border-raw-black p-6 md:p-8 overflow-y-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-4 md:mb-6 underline decoration-4 md:decoration-8 decoration-brand-orange text-raw-black">MISSION_DETAILS</h2>
          <p className="text-base md:text-lg font-bold text-brand-night mb-6 md:mb-8 leading-tight">
            {sprint.description}
          </p>

          <div className="bg-raw-white brutal-border p-4 md:p-6 brutal-shadow mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-black mb-4 uppercase bg-brand-night text-white inline-block px-2">Constraints:</h3>
            <ul className="space-y-3 md:space-y-4">
              {sprint.constraints.map((c, i) => (
                <li key={i} className="flex items-start gap-2 md:gap-3 font-bold text-brand-night text-sm md:text-base">
                  <span className="bg-brand-orange text-white px-1 text-xs mt-1 shrink-0">#0{i+1}</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* AI REVIEW RESULTS: Integrated & Responsive */}
          {review && (
            <div className="brutal-border brutal-shadow bg-raw-white p-4 md:p-6 my-6 animate-in slide-in-from-bottom-5 duration-500">
                <div className="flex justify-between items-center mb-4 border-b-4 border-raw-black pb-2">
                    <h3 className="text-xl md:text-2xl font-black italic uppercase">AUDIT_REPORT</h3>
                    <div className="text-2xl md:text-3xl font-black text-brand-orange">{review.score}%</div>
                </div>
                <div className={`text-lg md:text-xl font-black mb-2 px-2 inline-block ${review.status === 'Passed' ? 'bg-green-400' : 'bg-red-500 text-white'}`}>
                    {review.status.toUpperCase()}
                </div>
                <p className="font-bold text-brand-night mt-3 leading-tight text-sm md:text-base">{review.summary}</p>
                
                {review.issues.length > 0 && (
                    <div className="mt-6 border-t-2 border-dashed border-raw-black pt-4">
                        <ul className="space-y-3">
                            {review.issues.map((issue, idx) => (
                                <li key={idx} className="text-xs md:text-sm font-bold bg-slate-100 p-2 brutal-border">
                                    <span className="text-red-500 font-black">[{issue.type}]</span> {issue.msg}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
          )}
        </aside>

        {/* RIGHT PANEL: The Reactor (Code Editor) */}
        <main className="w-full md:w-[60%] lg:w-2/3 bg-brand-night p-4 md:p-6 relative flex flex-col min-h-[400px] md:min-h-0">
          <div className="hidden sm:block absolute top-0 right-10 bg-brand-orange text-white px-4 py-1 z-10 font-black brutal-border translate-y-[-50%]">
            V.2026_ENGINE
          </div>
          
          <div className="flex-grow brutal-border brutal-shadow bg-raw-black overflow-hidden h-full">
            <Editor
              height="100%"
              theme="vs-dark"
              defaultLanguage="javascript"
              value={userCode}
              onChange={(val) => setUserCode(val)}
              options={{
                fontSize: 14,
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

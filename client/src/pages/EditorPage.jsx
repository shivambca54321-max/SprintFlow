import React, { useEffect, useState } from 'react';
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
      }
    };
    fetchSprint();
  }, [id]);

  const handleSubmit = async () => {
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
  };

  if (!sprint) return <div className="bg-brand-night h-screen p-10 font-black text-brand-cream text-5xl italic animate-pulse">LOADING_DATA...</div>;

  return (
    <div className="h-screen bg-brand-cream flex flex-col border-[10px] border-raw-black overflow-hidden">
      
      {/* 1. TOP NAV BAR: Loud and Boxy */}
      <nav className="border-b-[6px] border-raw-black bg-brand-orange p-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="brutal-border bg-raw-white px-4 py-2 font-black brutal-shadow-hover active:translate-y-1 transition-all"
          >
            ← BACK
          </button>
          <h1 className="text-3xl font-black text-raw-black uppercase tracking-tighter">
            SPRINT: <span className="bg-raw-black text-white px-2 italic">{sprint.title}</span>
          </h1>
        </div>
        
        <div className="flex gap-4">
          <div className="font-mono font-bold bg-brand-night text-brand-cream px-4 py-2 brutal-border">
            STATUS: [ {isAnalyzing ? "ANALYZING..." : "CODING"} ]
          </div>
          <button 
            onClick={handleSubmit}
            disabled={isAnalyzing}
            className="brutal-border bg-green-400 px-8 py-2 font-black text-xl brutal-shadow brutal-shadow-hover active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-50"
          >
            {isAnalyzing ? "AUDITING..." : "SUBMIT_FOR_AUDIT"}
          </button>
        </div>
      </nav>

      {/* 2. MAIN WORKSPACE: Asymmetrical Split */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT PANEL: The Dossier (Instructions) */}
        <aside className="w-1/3 bg-brand-cream border-r-[6px] border-raw-black p-8 overflow-y-auto">
          <h2 className="text-4xl font-black mb-6 underline decoration-8 decoration-brand-orange">MISSION_DETAILS</h2>
          <p className="text-lg font-bold text-brand-night mb-8 leading-tight">
            {sprint.description}
          </p>

          <div className="bg-raw-white brutal-border p-6 brutal-shadow mb-8">
            <h3 className="text-2xl font-black mb-4 uppercase bg-brand-night text-white inline-block px-2">System_Constraints:</h3>
            <ul className="space-y-4">
              {sprint.constraints.map((c, i) => (
                <li key={i} className="flex items-start gap-3 font-bold text-brand-night">
                  <span className="bg-brand-orange text-white px-1 text-sm mt-1">#0{i+1}</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Neo-Brutalist Tip Box */}
          <div className="border-4 border-dashed border-raw-black p-4 bg-yellow-200 mb-8">
            <span className="font-black">WARNING:</span> The AI Architect will fail any code that lacks proper error handling or documentation.
          </div>

          {/* AI REVIEW RESULTS */}
          {review && (
            <div className="brutal-border brutal-shadow bg-raw-white p-6 animate-in slide-in-from-bottom-5 duration-500">
                <div className="flex justify-between items-center mb-4 border-b-4 border-raw-black pb-2">
                    <h3 className="text-2xl font-black italic uppercase">AI_AUDIT_REPORT</h3>
                    <div className="text-3xl font-black text-brand-orange">{review.score}/100</div>
                </div>
                <div className={`text-xl font-black mb-2 px-2 inline-block ${review.status === 'Passed' ? 'bg-green-400' : 'bg-red-500 text-white'}`}>
                    STATUS: {review.status.toUpperCase()}
                </div>
                <p className="font-bold text-brand-night mt-3 leading-tight">{review.summary}</p>
                
                {review.issues.length > 0 && (
                    <div className="mt-6">
                        <h4 className="font-black border-b-2 border-raw-black mb-2">IDENTIFIED_FLAWS:</h4>
                        <ul className="space-y-3">
                            {review.issues.map((issue, idx) => (
                                <li key={idx} className="text-sm font-bold bg-slate-100 p-2 brutal-border">
                                    <span className="text-red-500 font-black">[LINE {issue.line} | {issue.type}]</span> {issue.msg}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
          )}
        </aside>

        {/* RIGHT PANEL: The Reactor (Code Editor) */}
        <main className="w-2/3 bg-brand-night p-6 relative flex flex-col">
          <div className="absolute top-0 right-10 bg-brand-orange text-white px-4 py-1 z-10 font-black brutal-border translate-y-[-50%]">
            V.2026_ENGINE
          </div>
          
          <div className="flex-grow brutal-border brutal-shadow bg-raw-black overflow-hidden">
            <Editor
              height="100%"
              theme="vs-dark"
              defaultLanguage="javascript"
              value={userCode}
              onChange={(val) => setUserCode(val)}
              options={{
                fontSize: 18,
                fontFamily: 'JetBrains Mono, monospace',
                minimap: { enabled: false },
                padding: { top: 20 },
                lineNumbersMinChars: 3,
                fontWeight: "bold",
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditorPage;

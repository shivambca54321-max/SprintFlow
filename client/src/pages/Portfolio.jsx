import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Portfolio = () => {
  const [passedSprints, setPassedSprints] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('sprintflow_user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
        // You would normally fetch populated data here, but we'll simulate fetching passed sprints
        // or actually fetch them if we build a route. Let's assume we fetch all sprints and filter
        fetchCompletedSprints(JSON.parse(storedUser)._id);
    } else {
        navigate('/auth');
    }
  }, [navigate]);

  const fetchCompletedSprints = async (userId) => {
    try {
        const { data } = await axios.get(`http://localhost:5000/api/user/${userId}/portfolio`);
        setPassedSprints(data.completedSprints || []);
    } catch (error) {
        console.error("Failed to fetch portfolio data.");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-brand-cream p-6 md:p-12 relative overflow-hidden">
      {/* Back button */}
      <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 brutal-border bg-white px-4 py-2 font-black text-raw-black brutal-shadow-hover hover:-translate-y-1 transition-transform z-10"
      >
          ← DASHBOARD
      </button>

      <header className="border-b-[6px] md:border-b-8 border-raw-black pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end mt-16 md:mt-0 gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-black text-black leading-none tracking-tighter">PROVEN_SKILLS</h1>
          <p className="text-xl md:text-2xl font-bold text-brand-orange mt-2 italic bg-brand-night px-2 inline-block">VERIFIED BY SPRINTFLOW_AI_ARCHITECT</p>
        </div>
        <button 
            onClick={() => window.print()}
            className="w-full md:w-auto brutal-border bg-black text-white px-8 py-4 font-black text-xl brutal-shadow brutal-shadow-hover transition-transform"
        >
          PRINT_PORTFOLIO
        </button>
      </header>

      <div className="mb-12 flex gap-4 md:gap-8 flex-wrap">
          <div className="bg-brand-orange text-raw-black p-4 brutal-border brutal-shadow flex-[1] min-w-[200px]">
              <span className="block font-black text-sm uppercase opacity-80">VERIFIED AGENT</span>
              <span className="block text-3xl font-black">{user.username}</span>
          </div>
          <div className="bg-white text-raw-black p-4 brutal-border brutal-shadow flex-[1] min-w-[200px]">
              <span className="block font-black text-sm uppercase opacity-80">OFFICIAL RANK</span>
              <span className="block text-3xl font-black">{user.rank}</span>
          </div>
          <div className="bg-brand-night text-white p-4 brutal-border brutal-shadow flex-[1] min-w-[200px]">
              <span className="block font-black text-sm uppercase opacity-80">TOTAL XP</span>
              <span className="block text-3xl font-black text-green-400">{user.experiencePoints}</span>
          </div>
      </div>

      <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
        {passedSprints.length === 0 ? (
          <div className="bg-white text-2xl md:text-3xl font-black text-raw-black/50 border-8 border-dashed border-raw-black p-12 md:p-20 text-center brutal-shadow">
            NO_VERIFIED_SKILLS_YET.<br />
            <span className="text-brand-orange text-lg md:text-xl block mt-4">COMPLETE_SPRINTS_TO_BUILD_PORTFOLIO.</span>
          </div>
        ) : (
          passedSprints.map((sprint, i) => (
            <div key={i} className="bg-white brutal-border border-[6px] p-6 md:p-8 brutal-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:-translate-y-1 transition-transform">
              <div className="max-w-xl">
                <span className="bg-brand-night text-white px-3 py-1 font-black text-sm uppercase shadow-[2px_2px_0_#C05800]">#CERTIFIED</span>
                <h3 className="text-3xl md:text-4xl font-black mt-4 tracking-tighter uppercase leading-none text-raw-black">{sprint.title}</h3>
                <p className="text-lg font-bold text-gray-600 mt-2">{sprint.category || 'MERN Stack'} • Audited 2026</p>
              </div>
              <div className="text-left md:text-right w-full md:w-auto bg-gray-100 p-4 brutal-border">
                <div className="text-4xl md:text-5xl font-black text-green-500">100%</div>
                <div className="font-mono font-bold text-xs uppercase tracking-tighter mt-1">Architect_Score</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Portfolio;

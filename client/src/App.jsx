import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SprintCard } from './components/SprintCard';

const App = () => {
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/sprints');
        setSprints(data);
      } catch (err) {
        console.error("Backend connection failed");
      } finally {
        setLoading(false);
      }
    };
    fetchSprints();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 md:p-12">
      <header className="max-w-6xl mx-auto mb-16 text-center">
        <h1 className="text-5xl font-black tracking-tight mb-4 text-white">
          Sprint<span className="text-blue-500">Flow</span>
        </h1>
        <p className="text-slate-400 text-lg">Select a challenge to begin your AI-audited session.</p>
      </header>

      <main className="max-w-7xl mx-auto">
        {loading ? (
          <p className="text-center animate-pulse">Loading Sprints...</p>
        ) : (
          /* THIS IS THE IMPORTANT PART: grid-cols-1, md:grid-cols-2, etc. */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sprints.map(sprint => (
              <SprintCard 
                key={sprint._id} 
                sprint={sprint} 
                onSelect={(s) => window.location.href = `/editor/${s._id}`} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { SprintCard } from './components/SprintCard';
import { UserHeader } from './components/UserHeader';

const App = () => {
  const [sprints, setSprints] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Optimization: Persistent axios instance for cleaner calls
  const api = useMemo(() => axios.create({ baseURL: 'http://localhost:5000/api' }), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sprintsRes, userRes] = await Promise.all([
          api.get('/sprints'),
          api.get('/user/demo')
        ]);
        setSprints(sprintsRes.data);
        setUser(userRes.data);
      } catch (err) {
        console.error("Critical System failure.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [api]);

  return (
    <div className="min-h-screen bg-brand-night p-4 sm:p-8 md:p-16">
      <header className="max-w-7xl mx-auto mb-12 md:mb-16 text-center border-b-[6px] md:border-b-8 border-raw-black pb-8 md:pb-12">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-brand-orange leading-none tracking-tighter">
          Sprint<span className="text-raw-white">Flow</span>
          <span className="text-brand-cream block text-4xl sm:text-5xl md:text-6xl mt-4">NEO</span>
        </h1>
      </header>

      {/* COMMAND CENTER: The User Progress Header */}
      <UserHeader user={user} />

      <main className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center text-3xl md:text-4xl font-black text-brand-orange animate-pulse py-20">
            [BOOTING_SYSTEM...]
          </div>
        ) : (
          /* Grid: Optimized gaps and columns for all device sizes */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-10 lg:gap-12">
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

      <footer className="max-w-7xl mx-auto mt-16 md:mt-24 border-t-4 border-raw-black pt-8 text-center md:text-right">
        <p className="text-xs font-mono text-brand-cream bg-raw-black inline-block px-4 py-2 brutal-border">
          // PROOF-OF-WORK PLATFORM V2.0 // AGENTIC REVIEW ACTIVE // 2026
        </p>
      </footer>
    </div>
  );
};

export default App;
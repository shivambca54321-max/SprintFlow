import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SprintCard } from './components/SprintCard';

const App = () => {
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We are still connected to the same Gold State Backend
    const fetchSprints = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/sprints');
        setSprints(data);
      } catch (err) {
        console.error("Backend connection failed. Is your server running?");
      } finally {
        setLoading(false);
      }
    };
    fetchSprints();
  }, []);

  return (
    /* The core container: Using your brand-night background */
    <div className="min-h-screen bg-brand-night p-6 md:p-16">
      <header className="max-w-7xl mx-auto mb-20 text-center border-b-8 border-raw-black pb-12">
        {/* Title: Huge, Raw, Flat color */}
        <h1 className="text-8xl md:text-9xl font-black text-brand-orange leading-none tracking-tighter">
          Sprint<span className="text-raw-white">Flow</span>
          <span className="text-brand-cream block text-6xl mt-4 text-center">NEO</span>
        </h1>
        {/* Subtitle: High contrast cream text */}
        <p className="text-brand-cream text-2xl max-w-3xl mx-auto mt-8 font-medium">
          Select your challenge. Master the stack. Get audited by the AI Architect.
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        {loading ? (
          /* Loading State: Bold, simple text */
          <div className="text-center text-4xl font-black text-brand-orange animate-pulse">
            INITIALIZING SECURE LINK...
          </div>
        ) : (
          /* Grid: Boxy structure with large gaps */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-center">
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

      {/* A slightly broken layout footer: Asymmetrical */}
      <footer className="max-w-7xl mx-auto mt-24 border-t-4 border-raw-black pt-8 text-right asymmetrical-footer">
        <p className="text-sm font-mono text-brand-cream bg-raw-black inline-block px-4 py-2">
          // PROOF-OF-WORK PLATFORM V2.0 // AGENTIC REVIEW ACTIVE // 2026
        </p>
      </footer>
    </div>
  );
};

export default App;
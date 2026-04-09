import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { SprintCard } from '../components/SprintCard';
import { UserHeader } from '../components/UserHeader';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [sprints, setSprints] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const api = useMemo(() => axios.create({ baseURL: 'http://localhost:5000/api' }), []);

  useEffect(() => {
    // Check for cached user session
    const storedUser = localStorage.getItem('sprintflow_user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }

    const fetchData = async () => {
      try {
        const sprintsRes = await api.get('/sprints');
        setSprints(sprintsRes.data);
      } catch (err) {
        console.error("Critical System failure.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [api]);

  const handleLogout = () => {
      localStorage.removeItem('sprintflow_token');
      localStorage.removeItem('sprintflow_user');
      setUser(null);
  };

  return (
    <div className="min-h-screen bg-brand-night p-4 sm:p-8 md:p-16 relative">
      <header className="max-w-7xl mx-auto mb-12 md:mb-16 text-center border-b-[6px] md:border-b-8 border-raw-black pb-8 md:pb-12">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-brand-orange leading-none tracking-tighter">
          Sprint<span className="text-raw-white">Flow</span>
          <span className="text-brand-cream block text-4xl sm:text-5xl md:text-6xl mt-4">NEO</span>
        </h1>
      </header>

      {/* COMMAND CENTER: The User Progress Header */}
      <UserHeader 
         user={user} 
         onLoginClick={() => navigate('/auth')}
         onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center text-3xl md:text-4xl font-black text-brand-orange animate-pulse py-20">
            INITIALIZING_MAINFRAME...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {sprints.map(sprint => (
              <SprintCard 
                key={sprint._id} 
                sprint={sprint} 
                onSelect={() => navigate(`/editor/${sprint._id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;

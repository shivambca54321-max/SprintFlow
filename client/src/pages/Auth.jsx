import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
        const { data } = await axios.post(`http://localhost:5000${endpoint}`, { username, password });
        localStorage.setItem('sprintflow_token', data.token);
        localStorage.setItem('sprintflow_user', JSON.stringify(data));
        navigate('/'); // Go back to Home
    } catch (err) {
        setError(err.response?.data?.error || 'AUTHENTICATION_FAILED');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-night flex items-center justify-center p-6">
      <div className="bg-brand-cream brutal-border brutal-shadow p-10 w-full max-w-md">
        <h1 className="text-5xl font-black mb-8 underline decoration-brand-orange text-black">
          {isLogin ? "LOG_IN" : "SIGN_UP"}
        </h1>
        
        {error && (
            <div className="bg-red-500 text-white font-black brutal-border p-3 mb-6 uppercase text-sm">
                ⚠️ {error}
            </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <input 
             type="text" 
             placeholder="USERNAME" 
             className="w-full brutal-border p-4 font-bold outline-none focus:bg-yellow-100 placeholder-black" 
             value={username}
             onChange={(e) => setUsername(e.target.value)}
             required
          />
          <input 
             type="password" 
             placeholder="PASSWORD" 
             className="w-full brutal-border p-4 font-bold outline-none focus:bg-yellow-100 placeholder-black" 
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
          />
          
          <button 
             type="submit"
             disabled={loading}
             className="w-full bg-brand-orange text-white font-black py-4 text-2xl brutal-border brutal-shadow-hover transition-all disabled:opacity-50"
          >
            {loading ? "INITIALIZING..." : (isLogin ? "ENTER_SYSTEM →" : "CREATE_ACCOUNT →")}
          </button>
        </form>

        <p className="mt-6 font-bold cursor-pointer hover:text-brand-orange transition-colors" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "> NEED_AN_ACCOUNT?" : "> ALREADY_REGISTERED?"}
        </p>
      </div>
    </div>
  );
};

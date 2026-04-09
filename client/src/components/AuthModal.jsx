import React, { useState } from 'react';
import axios from 'axios';

export const AuthModal = ({ setUser, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

        try {
            const { data } = await axios.post(`http://localhost:5000${endpoint}`, { username, password });
            
            // Store token in LocalStorage
            localStorage.setItem('sprintflow_token', data.token);
            localStorage.setItem('sprintflow_user', JSON.stringify(data));
            
            setUser(data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'AUTHENTICATION_FAILED');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-raw-black/90 z-[100] flex items-center justify-center p-4">
            <div className="bg-brand-cream brutal-border brutal-shadow w-full max-w-md p-8 relative animate-in zoom-in-95 duration-200">
                <button 
                    onClick={onClose}
                    className="absolute -top-4 -right-4 brutal-border bg-brand-orange text-white w-10 h-10 font-black text-xl hover:scale-110 transition-transform"
                >
                    X
                </button>

                <h2 className="text-4xl font-black mb-6 underline decoration-8 decoration-brand-orange uppercase leading-none">
                    {isLogin ? 'SYSTEM_LOGIN' : 'REGISTER_AGENT'}
                </h2>

                {error && (
                    <div className="bg-red-500 text-white font-black brutal-border p-3 mb-6 uppercase text-sm animate-pulse">
                        ⚠️ ERROR: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-black text-brand-night uppercase text-sm mb-2">Agent Designation (Username)</label>
                        <input 
                            type="text" 
                            className="w-full brutal-border p-3 bg-white text-raw-black font-bold focus:outline-none focus:ring-4 focus:ring-brand-orange"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-black text-brand-night uppercase text-sm mb-2">Access Code (Password)</label>
                        <input 
                            type="password" 
                            className="w-full brutal-border p-3 bg-white text-raw-black font-bold focus:outline-none focus:ring-4 focus:ring-brand-orange"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full brutal-border bg-green-400 text-raw-black font-black py-4 text-xl brutal-shadow-hover hover:translate-x-1 hover:-translate-y-1 transition-transform disabled:opacity-50 uppercase"
                    >
                        {loading ? 'AUTHENTICATING...' : isLogin ? 'COMMENCE_LOGIN' : 'INITIALIZE_AGENT'}
                    </button>
                </form>

                <div className="mt-6 border-t-4 border-raw-black pt-4 text-center">
                    <button 
                        onClick={() => { setIsLogin(!isLogin); setError(null); }}
                        className="font-bold text-brand-orange hover:text-brand-night uppercase underline decoration-2 transition-colors"
                    >
                        {isLogin ? 'NEED_A_NEW_DESIGNATION? REGISTER HERE' : 'ALREADY_REGISTERED? LOGIN HERE'}
                    </button>
                </div>
            </div>
        </div>
    );
};

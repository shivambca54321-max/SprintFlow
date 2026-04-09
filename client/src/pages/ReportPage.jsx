import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReportPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('sprintflow_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/');
        }
    }, [navigate]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-raw-white p-8 font-sans text-raw-black flex flex-col items-center justify-center">
            
            <button 
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 brutal-border bg-brand-cream px-6 py-2 font-black brutal-shadow-hover transition-transform hover:-translate-x-1"
            >
                ← BACK TO DASHBOARD
            </button>

            {/* The Neo-Brutalist Report Card */}
            <div className="w-full max-w-4xl bg-brand-night brutal-border border-8 p-12 brutal-shadow" id="hiring-report">
                
                <div className="border-b-8 border-brand-orange pb-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-7xl md:text-8xl font-black text-brand-orange leading-none uppercase tracking-tighter">
                            PROOF_OF_WORK
                        </h1>
                        <p className="text-3xl text-brand-cream font-bold italic mt-2">
                            SPRINTFLOW_NEO_V1
                        </p>
                    </div>
                    <div className="bg-brand-orange text-raw-black p-4 brutal-border transform rotate-3">
                        <span className="block font-black text-sm uppercase">VERIFIED AGENT</span>
                        <span className="block text-4xl font-black">{user.username}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white brutal-border p-6 shadow-[8px_8px_0_#FFF] border-white">
                        <h2 className="text-brand-orange font-black text-2xl mb-2 uppercase">Official Rank</h2>
                        <p className="text-5xl font-black text-raw-black uppercase underline decoration-8 decoration-brand-orange leading-tight">{user.rank}</p>
                    </div>
                    <div className="bg-brand-cream brutal-border p-6 shadow-[8px_8px_0_#FDFBD4] border-brand-cream">
                        <h2 className="text-brand-night font-black text-2xl mb-2 uppercase">Total XP Mined</h2>
                        <p className="text-6xl font-black text-green-600">{user.experiencePoints} <span className="text-3xl italic">XP</span></p>
                    </div>
                </div>

                <div className="bg-raw-black text-brand-cream p-8 brutal-border border-brand-cream">
                    <h3 className="text-2xl font-black mb-4 uppercase text-brand-orange">SYSTEM_EVALUATION</h3>
                    <p className="text-lg font-bold leading-relaxed">
                        This document certifies that Agent <span className="text-brand-orange">{user.username}</span> has successfully passed rigorous algorithm and system architecture audits performed by the active AI Node on the SprintFlow platform. They have achieved the rank of {user.rank} and demonstrated senior-level software engineering capabilities.
                    </p>
                </div>
                
                <div className="mt-8 flex justify-end">
                    <button 
                        onClick={() => window.print()}
                        className="brutal-border bg-green-400 text-raw-black px-8 py-4 text-2xl font-black hover:bg-green-500 transition-colors uppercase"
                    >
                        PRINT_TO_PDF
                    </button>
                </div>
            </div>
            
        </div>
    );
};

export default ReportPage;

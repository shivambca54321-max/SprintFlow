import React from 'react';

export const UserHeader = ({ user }) => {
  if (!user) return null;

  // Simple Level Logic: Level up every 1000 XP
  const level = Math.floor(user.experiencePoints / 1000) + 1;
  const currentLevelXp = user.experiencePoints % 1000;
  const progress = (currentLevelXp / 1000) * 1000 / 10; // Result in 0-100 range
  
  return (
    <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row gap-6 items-center">
      {/* User Rank Box */}
      <div className="brutal-border bg-brand-orange p-4 brutal-shadow flex flex-col items-center min-w-[200px]">
        <span className="font-black text-xs uppercase text-raw-black opacity-70">CURRENT_RANK</span>
        <span className="text-2xl font-black text-white italic tracking-tighter">{user.rank}</span>
      </div>

      {/* Progress Bar Container */}
      <div className="flex-1 w-full brutal-border bg-white p-2 brutal-shadow relative">
        <div className="flex justify-between font-black text-sm mb-1 px-2 relative z-10 text-raw-black">
          <span className="bg-raw-white px-1">XP_PROGRESS (LVL_{level})</span>
          <span className="bg-raw-white px-1 tracking-widest">{user.experiencePoints} / {level * 1000} XP</span>
        </div>
        
        {/* The Actual Bar */}
        <div className="h-10 brutal-border bg-brand-night relative overflow-hidden">
           <div 
             className="h-full bg-green-400 transition-all duration-1000 border-r-4 border-raw-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" 
             style={{ width: `${progress}%` }}
           >
             {/* Animating Scanning Effect */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full animate-[pulse_2s_infinite]"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

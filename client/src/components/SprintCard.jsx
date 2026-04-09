import React from 'react';

export const SprintCard = ({ sprint, onSelect }) => {
  // Map difficulty to solid, high-contrast colors (ignoring standard pale colors)
  const difficultyConfig = {
    Easy: 'bg-green-400',
    Medium: 'bg-yellow-400',
    Hard: 'bg-red-500' // Strong red
  }[sprint.difficulty];

  return (
    <div 
      onClick={() => onSelect(sprint)}
      /* Raw, Boxy, Hard Shadow, Thick Border */
      className="bg-raw-white brutal-border brutal-shadow brutal-shadow-hover transition-all cursor-pointer p-8 flex flex-col group h-full"
    >
      <div className="flex justify-between items-center mb-6">
        {/* Category: Solid Cream background, Boxy */}
        <span className="brutal-border bg-brand-cream px-4 py-2 text-xs font-black uppercase tracking-widest text-brand-night">
          {sprint.category}
        </span>
        {/* XP: Large, Bold font */}
        <span className="font-mono text-xl font-extrabold text-brand-brown">
          {sprint.xpReward} XP
        </span>
      </div>
      
      {/* Title: Very Bold (Large, Heavy font) */}
      <h3 className="text-3xl font-black text-brand-night leading-tight group-hover:underline decoration-raw-black decoration-4">
        {sprint.title}
      </h3>
      
      {/* Description: High Contrast, clear text */}
      <p className="text-brand-night text-base mt-4 mb-8 flex-grow leading-relaxed">
        {sprint.description}
      </p>

      <div className="mt-auto flex items-center justify-between border-t-4 border-raw-black pt-6">
        {/* Difficulty: Strong solid colors, Raw text */}
        <span className={`brutal-border px-3 py-1 text-sm font-bold text-raw-black ${difficultyConfig}`}>
          {sprint.difficulty}
        </span>
        {/* Action Button: Flat, Bold */}
        <span className="text-raw-black text-lg font-black bg-brand-orange px-5 py-3 brutal-border brutal-shadow-pressed transition-transform">
          Start Sprint →
        </span>
      </div>
    </div>
  );
};
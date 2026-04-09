export const SprintCard = ({ sprint, onSelect }) => {
    return (
        <div
            onClick={() => onSelect(sprint)}
            className="bg-[#1e293b] border border-slate-700 p-6 rounded-2xl hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-blue-400 border border-blue-400/30">
                    {sprint.category}
                </span>
                <span className="text-emerald-400 font-mono text-sm font-bold">
                    {sprint.xpReward} XP
                </span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                {sprint.title}
            </h3>

            <p className="text-slate-400 text-sm mt-3 line-clamp-3 leading-relaxed">
                {sprint.description}
            </p>

            <div className="mt-6 flex items-center justify-between">
                <span className={`text-xs font-bold px-2 py-1 rounded ${sprint.difficulty === 'Hard' ? 'bg-red-900/30 text-red-400' :
                    sprint.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
                        'bg-green-900/30 text-green-400'
                    }`}>
                    {sprint.difficulty}
                </span>
                <span className="text-blue-500 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                    Start Sprint →
                </span>
            </div>
        </div>
    );
};
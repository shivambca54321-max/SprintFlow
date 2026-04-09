import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const EditorWorkspace = ({ sprint }) => {
    const [code, setCode] = useState(sprint.starterCode);
    const [review, setReview] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleSubmit = async () => {
        setIsAnalyzing(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/review', {
                userCode: code,
                sprintTitle: sprint.title,
                constraints: sprint.constraints
            });
            setReview(data);
        } catch (err) {
            alert("Review failed. Ensure server is running.");
        }
        setIsAnalyzing(false);
    };

    return (
        <div className="flex h-screen bg-[#1e1e1e] text-white">
            {/* Left Panel: Instructions */}
            <div className="w-1/3 p-6 border-r border-gray-700 overflow-y-auto">
                <h1 className="text-2xl font-bold text-blue-400">{sprint.title}</h1>
                <p className="mt-4 text-gray-300">{sprint.description}</p>
                <ul className="mt-6 space-y-2">
                    {sprint.constraints.map((c, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-400">
                            <span className="mr-2 text-blue-500">▹</span> {c}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right Panel: Editor & Review */}
            <div className="w-2/3 flex flex-col">
                <div className="flex-grow">
                    <Editor
                        height="100%"
                        theme="vs-dark"
                        defaultLanguage="javascript"
                        value={code}
                        onChange={(val) => setCode(val)}
                        options={{ fontSize: 14, minimap: { enabled: false } }}
                    />
                </div>

                <div className="h-1/3 border-t border-gray-700 p-4 bg-[#252526]">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 px-6 py-2 rounded font-bold hover:bg-blue-500 disabled:opacity-50"
                        disabled={isAnalyzing}
                    >
                        {isAnalyzing ? "ARCHITECT THINKING..." : "SUBMIT FOR AUDIT"}
                    </button>

                    {review && (
                        <div className="mt-4 animate-in fade-in duration-500">
                            <h3 className={`text-lg font-bold ${review.status === 'Passed' ? 'text-green-400' : 'text-red-400'}`}>
                                Result: {review.status} ({review.score}/100)
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">{review.summary}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditorWorkspace;
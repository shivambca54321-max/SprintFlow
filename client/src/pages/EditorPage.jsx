import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditorWorkspace from '../components/EditorWorkspace';

const EditorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sprint, setSprint] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSprint = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/sprints/${id}`);
                setSprint(data);
            } catch (err) {
                console.error("Failed to load sprint");
                navigate('/'); // Redirect home if sprint not found
            } finally {
                setLoading(false);
            }
        };
        fetchSprint();
    }, [id, navigate]);

    if (loading) return (
        <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center text-white">
            <p className="animate-pulse">Loading Workspace...</p>
        </div>
    );

    if (!sprint) return null;

    return <EditorWorkspace sprint={sprint} />;
};

export default EditorPage;

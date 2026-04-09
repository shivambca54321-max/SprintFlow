const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Sprint = require('./models/Sprint');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err));

const { reviewSubmission } = require('./controllers/aiController');

// Routes
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/', (req, res) => {
    res.send('SprintFlow API is running...');
});

app.get('/api/sprints', async (req, res) => {
    try {
        const sprints = await Sprint.find();
        res.json(sprints);
    } catch (err) {
        res.status(500).json({ message: "Error fetching sprints", error: err.message });
    }
});

app.get('/api/sprints/:id', async (req, res) => {
    try {
        const sprint = await Sprint.findById(req.params.id);
        res.json(sprint);
    } catch (err) {
        res.status(500).json({ message: "Error fetching sprint", error: err.message });
    }
});

const User = require('./models/User');

app.post('/api/review', reviewSubmission);

// PERSISTENCE_DEMO: Fetch or Create a mock user for the demo
app.get('/api/user/demo', async (req, res) => {
    try {
        let user = await User.findOne({ username: 'Agent_Zero' });
        if (!user) {
            user = await User.create({ username: 'Agent_Zero' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
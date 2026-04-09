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
const { registerUser, loginUser } = require('./controllers/authController');

app.post('/api/review', reviewSubmission);

// AUTHENTICATION ROUTES
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);

// PORTFOLIO ROUTE: Fetch populated completed sprints for User
app.get('/api/user/:id/portfolio', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('completedSprints');
        if (!user) return res.status(404).json({ error: 'AGENT_NOT_FOUND' });
        res.json({ completedSprints: user.completedSprints, experiencePoints: user.experiencePoints, rank: user.rank });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
});
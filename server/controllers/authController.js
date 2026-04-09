const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    // Note: In production, ensure JWT_SECRET is in your .env file
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_development';
    return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ error: 'AGENT_ALREADY_REGISTERED' });
        }

        const user = await User.create({ username, password });

        res.status(201).json({
            _id: user._id,
            username: user.username,
            rank: user.rank,
            experiencePoints: user.experiencePoints,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("REGISTRATION ERROR:", error);
        res.status(500).json({ error: error.message || 'SYSTEM_ERROR_DURING_REGISTRATION' });
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                rank: user.rank,
                experiencePoints: user.experiencePoints,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ error: 'ACCESS_DENIED: INVALID_CREDENTIALS' });
        }
    } catch (error) {
        res.status(500).json({ error: 'SYSTEM_ERROR_DURING_LOGIN' });
    }
};

const mongoose = require('mongoose');

const SprintSchema = new mongoose.Schema({
    title: { type: String, required: true },
    difficulty: String,
    category: String,
    description: String,
    starterCode: String,
    constraints: [String],
    xpReward: Number
});

module.exports = mongoose.model('Sprint', SprintSchema);
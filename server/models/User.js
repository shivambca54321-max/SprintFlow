const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, default: 'Agent_Zero' },
    experiencePoints: { type: Number, default: 0 },
    rank: { type: String, default: 'JUNIOR_ENFORCER' },
    completedSprints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' }]
});

module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // We will hash this!
    experiencePoints: { type: Number, default: 0 },
    rank: { type: String, default: 'JUNIOR_ENFORCER' },
    completedSprints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' }]
});

// Pre-save hook to hash passwords
UserSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to verify passwords
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);

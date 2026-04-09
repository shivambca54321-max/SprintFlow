const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  sprintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' },
  code: String,
  status: String, // "Passed" or "Failed"
  score: Number,
  feedback: Array,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);

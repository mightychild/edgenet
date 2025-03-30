const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'daily-check-in', 'wallet-connection', 'twitter-connection'
  description: { type: String, required: true }, // e.g., 'Complete daily check-in'
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  status: { type: String, default: 'pending' }, // e.g., 'pending', 'completed'
  reward: { type: Number, default: 0 }, // Reward in $EDGE points
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

module.exports = mongoose.model('Task', taskSchema);
const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referralCode: { type: String, unique: true },
  referralLink: { type: String, unique: true },
  totalReferrals: { type: Number, default: 0 },
});

module.exports = mongoose.model('Referral', referralSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String }, // For Google Sign-In
  referralCode: { type: String, unique: true }, // Unique referral code
  totalReferrals: { type: Number, default: 0 }, // Track total referrals
  edgeBalance: { type: Number, default: 0 }, // Track $EDGE points
  uptime: { type: Number, default: 0 },
  badges: [{ type: String }],
  walletAddress: { type: String, default: '' }, // Add wallet address field
  twitter: { type: String, default: '' }, // Connected Twitter account
  discord: { type: String, default: '' }, // Connected Discord account
  nonce: { type: String, default: () => Math.floor(Math.random() * 1000000).toString() }, // Unique nonce
});

// Generate a referral code before saving the user
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // Generate a referral code if it doesn't exist
  if (!this.referralCode) {
    this.referralCode = generateReferralCode();
  }

  next();
});

// Function to generate a unique referral code
const generateReferralCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

module.exports = mongoose.model('User', userSchema);
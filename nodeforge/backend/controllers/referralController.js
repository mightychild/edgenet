const User = require('../models/User');

// Get referral data for the logged-in user
exports.getReferralData = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate the referral link
    const referralLink = `${process.env.BASE_URL}/signup?ref=${user.referralCode}`;

    res.json({
      referralCode: user.referralCode,
      referralLink,
      totalReferrals: user.totalReferrals,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch referral data' });
  }
};
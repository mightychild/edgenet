const User = require('../models/User');

exports.getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) throw new Error('User not found');

    res.json({
      uptime: user.uptime,
      edgeBalance: user.edgeBalance,
      totalReferrals: user.totalReferrals,
      badges: user.badges,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
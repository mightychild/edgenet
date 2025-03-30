const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    // Check if the token is blacklisted
    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted) throw new Error('Token is invalid');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
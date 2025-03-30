const { body, validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Validation rules for user registration
exports.validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Register a new user
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Logout user
exports.logout = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

// Google Sign-In
exports.googleSignIn = async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if they don't exist
      user = new User({
        name,
        email,
        profilePicture: picture,
        password: 'google-auth', // Dummy password for Google users
      });
      await user.save();
    }

    // Generate a JWT token
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token: jwtToken, user });
  } catch (error) {
    res.status(400).json({ error: 'Google Sign-In failed' });
  }

// Google OAuth callback
exports.googleCallback = async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange the authorization code for tokens
    const { tokens } = await client.getToken({
      code,
      redirect_uri: 'http://localhost:5000/api/auth/google/callback',
    });

    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if they don't exist
      user = new User({
        name,
        email,
        profilePicture: picture,
        password: 'google-auth', // Dummy password for Google users
      });
      await user.save();
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Redirect to the extension with the token
    res.redirect(`chrome-extension://${process.env.EXTENSION_ID}/popup.html?token=${token}`);
  } catch (error) {
    res.status(400).json({ error: 'Google Login failed' });
  }
 }
};


exports.logout = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract the token

  try {
    // Add the token to the blacklist
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const blacklistedToken = new TokenBlacklist({
      token,
      expiresAt: new Date(decoded.exp * 1000), // Convert expiration time to Date
    });
    await blacklistedToken.save();

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Logout failed' });
  }
};
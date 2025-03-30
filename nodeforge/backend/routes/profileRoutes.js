const express = require('express');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all profile routes with authentication
router.use(authMiddleware.authenticate);

// Get user profile
router.get('/profile', profileController.getProfile);

module.exports = router;
const express = require('express');
const { getUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected route (requires authentication)
router.get('/:userId', authMiddleware, getUser);

module.exports = router;
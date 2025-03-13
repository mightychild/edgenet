const express = require('express');
const { getExtensionData } = require('../controllers/pointsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Fetch extension data
router.get('/extension-data', authMiddleware, getExtensionData);

module.exports = router;
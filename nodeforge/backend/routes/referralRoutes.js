const express = require('express');
const referralController = require('../controllers/referralController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all referral routes with authentication
router.use(authMiddleware.authenticate);

// Get referral data for the logged-in user
router.get('/', referralController.getReferralData);

module.exports = router;
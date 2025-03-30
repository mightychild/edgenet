const express = require('express');
const { getUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { getUser, updateWalletAddress, disconnectWallet, verifyWalletOwnership } = require('../controllers/userController');

const router = express.Router();

// Protected route (requires authentication)
router.get('/:userId', authMiddleware, getUser);


// Protected route (requires authentication)
router.get('/:userId', authMiddleware, getUser);

// Update wallet address
router.put('/wallet', authMiddleware, updateWalletAddress);

// Disconnect wallet
router.delete('/wallet', authMiddleware, disconnectWallet);

// Verify wallet ownership
router.post('/wallet/verify', authMiddleware, verifyWalletOwnership);

module.exports = router;
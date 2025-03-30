const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.validateRegister, authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/google', authController.googleSignIn); // Google Sign-In route
// router.get('/google/callback', authController.googleCallback); /// Google OAuth callback

module.exports = router;
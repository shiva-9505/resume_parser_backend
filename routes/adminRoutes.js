const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyAdminOTP);

router.post('/create-user', verifyToken, isAdmin, authController.createUser);
router.post('/login',authController.loginUser);

module.exports = router;

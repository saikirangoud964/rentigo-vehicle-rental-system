const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOTP,
  resetPassword,
} = require("../controllers/authController");

/*
========================================
AUTH ROUTES
========================================
*/

router.post("/register", registerUser);

router.post("/login", loginUser);

/*
========================================
FORGOT PASSWORD
========================================
*/

// Send OTP to email
router.post("/forgot-password", forgotPassword);

// Verify OTP
router.post("/verify-otp", verifyOTP);

// Reset password
router.post("/reset-password", resetPassword);

module.exports = router;

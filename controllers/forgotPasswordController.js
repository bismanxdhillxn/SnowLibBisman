// controllers/forgotPasswordController.js
const crypto                  = require("crypto");
const { hashPassword }        = require("../config/passwordUtils");
const User                    = require("../models/user");
const { sendOtpEmail }        = require("../config/emailConfig");
const {
  storeResetOtp,
  verifyResetOtp,
  getResetEmail,
  clearResetEmail,
} = require("../middleware/resetOtpSession");

exports.forgotPasswordStart = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // for security, respond 200 anyway
      return res.json({ message: "If that email exists, you’ll receive an OTP." });
    }

    // Generate and store OTP in session
    const otp = Math.floor(100000 + Math.random()*900000).toString();
    storeResetOtp(req, email, otp);

    // Send OTP via email
    await sendOtpEmail(email, otp);
    res.json({ message: "OTP sent to your email" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

exports.forgotPasswordVerify = async (req, res) => {
  try {
    const { otp, newPassword, confirmPassword } = req.body;
    if (!otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    if (!verifyResetOtp(req, otp)) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const email = getResetEmail(req);
    const user  = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "No user found for this email" });
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    clearResetEmail(req);
    res.json({ message: "Password has been reset. You can now log in." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reset password" });
  }
};

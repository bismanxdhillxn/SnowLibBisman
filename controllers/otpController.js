// controllers/otpController.js
const { hashPassword }          = require("../config/passwordUtils");
const User                      = require("../models/user");
const Role                      = require("../models/role");
const { sendOtpEmail }          = require("../config/emailConfig");
const { storeOtp, verifyOtp, getTmpUser, clearTmpUser } = require("../middleware/otpSession");

exports.otpRegisterStart = async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body;
    if (!name||!email||!password||!roleId)
      return res.status(400).json({ error: "All fields required" });

    if (await User.findOne({ where: { email } }))
      return res.status(400).json({ error: "Email already in use" });

    const role = await Role.findByPk(roleId);
    if (!role) return res.status(404).json({ error: "Role not found" });

    const otp = Math.floor(100000 + Math.random()*900000).toString();
    storeOtp(req, { name, email, password, roleId }, otp);

    await sendOtpEmail(email, otp);
    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

exports.otpRegisterVerify = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) return res.status(400).json({ error: "OTP is required" });

    if (!verifyOtp(req, otp))
      return res.status(400).json({ error: "Invalid or expired OTP" });

    const { name, email, password, roleId } = getTmpUser(req);
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ name, email, password: hashedPassword, roleId });

    clearTmpUser(req);
    res.status(201).json({
      message: "Registration complete",
      user: { id: user.id, name: user.name, email: user.email, roleId: user.roleId }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};

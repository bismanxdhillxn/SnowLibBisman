const express       = require("express");
const router        = express.Router();
const otpController = require("../controllers/otpController");

router.post("/register-start", otpController.otpRegisterStart);
router.post("/register-verify", otpController.otpRegisterVerify);

module.exports = router;

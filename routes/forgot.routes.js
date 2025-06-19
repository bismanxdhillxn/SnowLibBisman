// routes/forgot.routes.js
const express     = require("express");
const router      = express.Router();
const fpController = require("../controllers/forgotPasswordController");

router.post("/start",  fpController.forgotPasswordStart);
router.post("/verify", fpController.forgotPasswordVerify);

module.exports = router;

// middleware/resetOtpSession.js
const RESET_OTP_TTL = 5 * 60 * 1000; // 5 minutes

module.exports = {
  storeResetOtp: (req, email, otp) => {
    req.session.resetEmail      = email;
    req.session.resetOtp        = otp;
    req.session.resetOtpExpires = Date.now() + RESET_OTP_TTL;
  },

  verifyResetOtp: (req, submittedOtp) => {
    if (!req.session.resetOtp || !req.session.resetEmail) return false;
    if (Date.now() > req.session.resetOtpExpires)            return false;
    if (req.session.resetOtp !== submittedOtp)               return false;
    // OK—clear out
    delete req.session.resetOtp;
    delete req.session.resetOtpExpires;
    return true;
  },

  getResetEmail: (req) => req.session.resetEmail,
  clearResetEmail: (req) => { delete req.session.resetEmail; },
};

const OTP_TTL = 5 * 60 * 1000; // 5 minutes

module.exports = {
  storeOtp: (req, tmpUser, otp) => {
    req.session.tmpUser = tmpUser;
    req.session.otp        = otp;
    req.session.otpExpires = Date.now() + OTP_TTL;
  },

  verifyOtp: (req, submittedOtp) => {
    if (!req.session.otp || !req.session.tmpUser) return false;
    if (Date.now() > req.session.otpExpires)           return false;
    if (req.session.otp !== submittedOtp)              return false;
    // success—clear
    delete req.session.otp;
    delete req.session.otpExpires;
    return true;
  },

  getTmpUser: (req) => req.session.tmpUser,
  clearTmpUser: (req) => { delete req.session.tmpUser; },
};

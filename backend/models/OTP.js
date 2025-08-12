const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: String,
  phone: String,
  code: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['email_verification', 'phone_verification', 'password_reset'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
  },
  attempts: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Auto-delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTP', otpSchema);

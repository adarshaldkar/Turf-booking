const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailService = require('../utils/emailService');
const rateLimit = require('express-rate-limit');
const {
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  otpValidation
} = require('../utils/validation');

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { message: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // 3 OTP requests per window
  message: { message: 'Too many OTP requests, please try again later.' },
});

const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const signup = async (req, res) => {
  try {
    const { error } = signupValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { firstName, lastName, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, ...(phone ? [{ phone }] : [])]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email or phone number'
      });
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password
    });

    await user.save();

    // Generate and send OTP
    const otp = emailService.generateOTP();
    const otpDoc = new OTP({
      email,
      code: otp,
      type: 'email_verification'
    });
    await otpDoc.save();

    await emailService.sendOTP(email, otp);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Please verify your email.',
      data: {
        userId: user._id,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const login = [authLimiter, async (req, res) => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts'
      });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}];

const forgotPassword = [otpLimiter, async (req, res) => {
  try {
    const { error } = forgotPasswordValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not
      return res.json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.'
      });
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send reset email
    await emailService.sendPasswordResetEmail(email, resetToken);

    res.json({
      success: true,
      message: 'Password reset link sent to your email'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}];

const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.body;

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token is invalid or has expired'
      });
    }

    res.json({
      success: true,
      message: 'Token is valid'
    });

  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { error } = resetPasswordValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { token, password } = req.body;

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token is invalid or has expired'
      });
    }

    // Update password and clear reset token
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;

    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { error } = otpValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, phone, otp, verificationType } = req.body;

    // Find OTP
    const otpDoc = await OTP.findOne({
      ...(email && { email }),
      ...(phone && { phone }),
      code: otp,
      type: verificationType === 'phone' ? 'phone_verification' : 'email_verification',
      expiresAt: { $gt: new Date() },
      verified: false
    });

    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Check attempts
    if (otpDoc.attempts >= 3) {
      return res.status(400).json({
        success: false,
        message: 'Too many incorrect attempts. Please request a new OTP.'
      });
    }

    // Mark OTP as verified
    otpDoc.verified = true;
    await otpDoc.save();

    // Update user verification status
    const user = await User.findOne({
      ...(email && { email }),
      ...(phone && { phone })
    });

    if (user) {
      if (verificationType === 'phone') {
        user.phoneVerified = true;
      } else {
        user.emailVerified = true;
      }
      await user.save();

      const token = generateToken(user._id, user.role);

      res.json({
        success: true,
        message: 'OTP verified successfully',
        data: {
          token,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            emailVerified: user.emailVerified,
            phoneVerified: user.phoneVerified
          }
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const resendOTP = [otpLimiter, async (req, res) => {
  try {
    const { email, phone, verificationType } = req.body;

    // Find user
    const user = await User.findOne({
      ...(email && { email }),
      ...(phone && { phone })
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete existing OTPs for this user and type
    await OTP.deleteMany({
      ...(email && { email }),
      ...(phone && { phone }),
      type: verificationType === 'phone' ? 'phone_verification' : 'email_verification'
    });

    // Generate new OTP
    const otp = emailService.generateOTP();
    const otpDoc = new OTP({
      ...(email && { email }),
      ...(phone && { phone }),
      code: otp,
      type: verificationType === 'phone' ? 'phone_verification' : 'email_verification'
    });
    await otpDoc.save();

    // Send OTP
    if (email) {
      await emailService.sendOTP(email, otp);
    }
    // Add SMS service for phone verification if needed

    res.json({
      success: true,
      message: 'OTP sent successfully'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}];

module.exports = {
  signup,
  login,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  verifyOTP,
  resendOTP
};
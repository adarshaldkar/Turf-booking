const Joi = require('joi');

const passwordSchema = Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  });

const signupValidation = Joi.object({
  firstName: Joi.string().min(2).max(30).required().messages({
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name cannot exceed 30 characters'
  }),
  lastName: Joi.string().min(2).max(30).required().messages({
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name cannot exceed 30 characters'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address'
  }),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).optional().messages({
    'string.pattern.base': 'Please provide a valid 10-digit Indian phone number'
  }),
  password: passwordSchema.required()
});

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const forgotPasswordValidation = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordValidation = Joi.object({
  token: Joi.string().required(),
  password: passwordSchema.required()
});

const otpValidation = Joi.object({
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/),
  otp: Joi.string().length(6).pattern(/^\d+$/).required(),
  verificationType: Joi.string().valid('email', 'phone', 'signup').required()
}).or('email', 'phone');

module.exports = {
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  otpValidation
};

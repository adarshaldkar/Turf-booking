const express = require('express');
const router = express.Router();
const {
  sendWelcomeEmail,
  sendBookingConfirmation,
  sendPasswordResetEmail,
  sendContactFormEmail,
  testEmail
} = require('../controllers/email-controller');

// Test email endpoint
router.post('/test', testEmail);

// Send welcome email to new user
router.post('/welcome', sendWelcomeEmail);

// Send booking confirmation email
router.post('/booking-confirmation', sendBookingConfirmation);

// Send password reset email
router.post('/password-reset', sendPasswordResetEmail);

// Send contact form email
router.post('/contact', sendContactFormEmail);

module.exports = router;

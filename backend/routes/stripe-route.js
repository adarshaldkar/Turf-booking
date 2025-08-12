const express = require('express');
const router = express.Router();
const {
  createStripePayment,
  confirmStripePayment,
  getStripePaymentDetails,
  testStripePayment
} = require('../controllers/stripe-controller');

// Create payment intent
router.post('/create-payment-intent', createStripePayment);

// Confirm payment
router.post('/confirm-payment', confirmStripePayment);

// Get payment details
router.get('/payment-details/:paymentIntentId', getStripePaymentDetails);

// Test payment (for development)
router.post('/test', testStripePayment);

module.exports = router;

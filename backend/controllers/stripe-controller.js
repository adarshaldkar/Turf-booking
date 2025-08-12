const { createPaymentIntent, confirmPayment, getPaymentDetails } = require('../config/stripe');

// Create Payment Intent
const createStripePayment = async (req, res) => {
  try {
    const { amount, currency = 'inr' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount provided'
      });
    }

    const result = await createPaymentIntent(amount, currency);

    if (result.success) {
      res.status(200).json({
        success: true,
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId,
        message: 'Payment intent created successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to create payment intent',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in createStripePayment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Confirm Payment
const confirmStripePayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment Intent ID is required'
      });
    }

    const result = await confirmPayment(paymentIntentId);

    if (result.success) {
      res.status(200).json({
        success: true,
        status: result.status,
        amount: result.amount,
        currency: result.currency,
        message: 'Payment confirmed successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to confirm payment',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in confirmStripePayment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get Payment Details
const getStripePaymentDetails = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment Intent ID is required'
      });
    }

    const result = await getPaymentDetails(paymentIntentId);

    if (result.success) {
      res.status(200).json({
        success: true,
        paymentDetails: result.paymentIntent,
        message: 'Payment details retrieved successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to get payment details',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in getStripePaymentDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Test Payment (for development)
const testStripePayment = async (req, res) => {
  try {
    const testAmount = 100; // ₹1.00
    const result = await createPaymentIntent(testAmount, 'inr');

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Test payment intent created',
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId,
        amount: testAmount
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to create test payment',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in testStripePayment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createStripePayment,
  confirmStripePayment,
  getStripePaymentDetails,
  testStripePayment
};

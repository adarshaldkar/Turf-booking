const stripe = require('stripe');

// Create Stripe instance only if credentials are available
const createStripeInstance = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('Stripe secret key not found. Payment functionality will be disabled.');
    return null;
  }
  
  return stripe(process.env.STRIPE_SECRET_KEY);
};

const stripeInstance = createStripeInstance();

// Verify Stripe connection
const verifyConnection = async () => {
  try {
    if (!stripeInstance) {
      console.warn('Stripe not configured. Skipping connection verification.');
      return false;
    }
    const account = await stripeInstance.accounts.retrieve();
    console.log('Stripe connection verified successfully');
    return true;
  } catch (error) {
    console.error('Stripe connection failed:', error.message);
    return false;
  }
};

// Create payment intent
const createPaymentIntent = async (amount, currency = 'inr') => {
  try {
    if (!stripeInstance) {
      return {
        success: false,
        error: 'Stripe is not configured'
      };
    }
    
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: amount * 100, // Convert to smallest currency unit (paise for INR)
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Confirm payment
const confirmPayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId);
    return {
      success: true,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    };
  } catch (error) {
    console.error('Error confirming payment:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get payment details
const getPaymentDetails = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId);
    return {
      success: true,
      paymentIntent
    };
  } catch (error) {
    console.error('Error getting payment details:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  stripeInstance,
  verifyConnection,
  createPaymentIntent,
  confirmPayment,
  getPaymentDetails
};

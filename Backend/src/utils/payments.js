import Stripe from "stripe";

// Initialize Stripe instance with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Creates a Stripe PaymentIntent.
 * @param {number} amount - The amount in the smallest currency unit (e.g., paise).
 * @param {string} currency - The currency code (e.g., 'inr').
 * @param {object} metadata - An object to store relevant info, like bookingId.
 * @returns {Promise<object>} The Stripe PaymentIntent object.
 */
const createPaymentIntent = async (amount, currency = "inr", metadata = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      // Explicitly define the payment method types you want to accept
      payment_method_types: ["card", "upi"],
    });
    return paymentIntent;
  } catch (error) {
    console.error("Error creating Stripe PaymentIntent:", error);
    throw new Error("Could not create payment intent.");
  }
};

/**
 * Verifies and constructs a webhook event from Stripe.
 * @param {Buffer} body - The raw request body from Express.
 * @param {string} signature - The 'stripe-signature' header from the request.
 * @param {string} secret - The webhook signing secret from your Stripe dashboard.
 * @returns {Stripe.Event} The verified Stripe event object.
 */
const constructWebhookEvent = (body, signature, secret) => {
  try {
    return stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error(`⚠️  Webhook signature verification failed.`, err.message);
    throw new Error("Webhook signature verification failed.");
  }
};

export { createPaymentIntent, constructWebhookEvent };

import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    provider: {
      type: String,
      enum: ["stripe", "razorpay"],
      required: true,
    },
    // Stripe fields
    stripePaymentIntentId: { type: String, unique: true, sparse: true },
    // Razorpay fields --> Not able to integrate due to documentation issues
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    // Generic
    amount: { type: Number, required: true }, // in INR rupees
    currency: { type: String, default: "inr" },
    status: {
      type: String,
      enum: ["requires_payment_method", "succeeded", "failed"],
      default: "requires_payment_method",
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
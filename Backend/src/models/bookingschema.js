import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
    },
    courtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Court",
      required: true,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);



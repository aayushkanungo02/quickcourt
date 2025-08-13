import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
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
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    sportType: { type: String },
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
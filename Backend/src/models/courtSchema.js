import mongoose from "mongoose";

const courtSchema = new mongoose.Schema(
  {
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
    },
    name: { type: String, required: true },
    sportType: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    operatingHours: {
      start: { type: String, required: true }, // e.g., "08:00"
      end: { type: String, required: true }, // e.g., "22:00"
    },
  },
  { timestamps: true }
);

export const Court = mongoose.model("Court", courtSchema);

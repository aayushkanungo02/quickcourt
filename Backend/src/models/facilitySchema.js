import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    supportedSports: [{ type: String }],
    amenities: [{ type: String }],
    photos: {
      type: [String], // up to 3 URLs
      validate: [
        function (arr) {
          return Array.isArray(arr) && arr.length <= 3;
        },
        "At most 3 photos are allowed",
      ],
      default: [],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  { timestamps: true }
);

export const Facility = mongoose.model("Facility", facilitySchema);

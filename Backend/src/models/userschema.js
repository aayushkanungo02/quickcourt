import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, // We'll store the URL of the uploaded image
      default: "https://placehold.co/400x400/000000/FFFFFF?text=User",
    },
    role: {
      type: String,
      enum: ["User", "Facility Owner"],
      default: "User",
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Number,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const user = mongoose.model("User", userSchema);

export default user;

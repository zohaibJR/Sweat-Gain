import mongoose from "mongoose";

const AuthCodeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    purpose: {
      type: String,
      required: true,
      enum: ["signup", "password_reset"],
    },
    otpHash: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    resetTokenHash: { type: String, default: null },
    resetTokenExpiresAt: { type: Date, default: null },
    signupData: {
      name: { type: String, default: "" },
      country: { type: String, default: "" },
      password: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

AuthCodeSchema.index({ email: 1, purpose: 1 }, { unique: true });

export default mongoose.model("AuthCode", AuthCodeSchema);

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
  country:          { type: String, required: true, trim: true },
  password:         { type: String, required: true },
  isPro:            { type: Boolean, default: false },
  proActivatedAt:   { type: Date, default: null },
  proExpiresAt:     { type: Date, default: null },
  proSource:        { type: String, enum: ['trial', 'payment', 'manual'], default: null },
  trialStartedAt:   { type: Date, default: null },
  trialUsed:        { type: Boolean, default: false },
  isAdmin:          { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);

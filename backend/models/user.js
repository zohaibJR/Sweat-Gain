import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
  country:          { type: String, required: true, trim: true },
  password:         { type: String, required: true },
  isPro:            { type: Boolean, default: false },
  isAdmin:          { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
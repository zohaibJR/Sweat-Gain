import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  targetWeight:  { type: Number, required: true },
  startWeight:   { type: Number, required: true },
  currentWeight: { type: Number, required: true },
  targetDate:    { type: Date, default: null },
  achieved:      { type: Boolean, default: false },
  achievedAt:    { type: Date, default: null },
  notes:         { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Goal', goalSchema);
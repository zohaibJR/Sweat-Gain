import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:   { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent'], required: true },
  weight: { type: Number, required: true },
  exercises: {
    type: [String],
    enum: ['Chest','Biceps','Triceps','Legs','Back','Shoulders','Cardio','Full Body','Arms','Core'],
    default: []
  }
}, { timestamps: true });

attendanceSchema.index({ user: 1, date: 1 }, { unique: true });
export default mongoose.model('Attendance', attendanceSchema);
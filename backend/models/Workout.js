import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    exercise: {
      type: String,
      required: true,
      trim: true,
    },
    muscle: {
      type: String,
      required: true,
      trim: true,
    },
    sets: {
      type: Number,
      required: true,
      min: 1,
    },
    reps: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

workoutSchema.index({ userId: 1, date: -1 });

export default mongoose.model('Workout', workoutSchema, 'workouts');

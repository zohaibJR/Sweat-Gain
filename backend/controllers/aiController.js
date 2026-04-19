import User from '../models/user.js';
import { getWorkoutSuggestionForUser, DEFAULT_BEGINNER_PLAN } from '../services/workoutSuggestionService.js';

export const suggestWorkout = async (req, res) => {
  try {
    const email = (req.query.email || '').trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: 'Email query parameter is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const plan = await getWorkoutSuggestionForUser(user._id);
    return res.json(plan || DEFAULT_BEGINNER_PLAN);
  } catch (error) {
    console.error('suggestWorkout error:', error);
    return res.status(500).json({ message: 'Failed to generate workout suggestion' });
  }
};

import Goal       from '../models/Goal.js';
import User       from '../models/user.js';
import Attendance from '../models/Attendence.js';

// ──────────────────────────────────────────────────────────────
// POST /api/goals   (Pro only — guarded by isPro middleware)
// Body: { email, targetWeight, targetDate?, notes? }
// Creates or replaces the user's single active goal
// ──────────────────────────────────────────────────────────────
export const setGoal = async (req, res) => {
  try {
    const { email, targetWeight, targetDate, notes } = req.body;

    if (!targetWeight)
      return res.status(400).json({ message: 'Target weight is required' });

    const parsedTarget = parseFloat(targetWeight);
    if (isNaN(parsedTarget) || parsedTarget <= 0)
      return res.status(400).json({ message: 'Invalid target weight' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Pull latest weight from attendance to use as start + current
    const latest = await Attendance.findOne({ user: user._id }).sort({ date: -1 });
    const baseWeight = latest ? latest.weight : parsedTarget;

    const goal = await Goal.findOneAndUpdate(
      { user: user._id },
      {
        user:          user._id,
        targetWeight:  parsedTarget,
        startWeight:   baseWeight,
        currentWeight: baseWeight,
        targetDate:    targetDate ? new Date(targetDate) : null,
        notes:         notes || '',
        achieved:      false,
        achievedAt:    null,
      },
      { upsert: true, new: true }
    );

    res.json({ message: 'Goal set successfully', goal });
  } catch (err) {
    console.error('setGoal error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// GET /api/goals?email=   (Pro only)
// Returns goal with live progress + days remaining
// ──────────────────────────────────────────────────────────────
export const getGoal = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let goal = await Goal.findOne({ user: user._id });
    if (!goal) return res.json({ goal: null, progress: 0, daysRemaining: null });

    // Sync current weight from latest attendance
    const latest       = await Attendance.findOne({ user: user._id }).sort({ date: -1 });
    const currentWeight = latest ? latest.weight : goal.currentWeight;

    // Check if goal achieved
    const isLossGoal = goal.startWeight > goal.targetWeight;
    const achieved   = isLossGoal
      ? currentWeight <= goal.targetWeight
      : currentWeight >= goal.targetWeight;

    goal = await Goal.findOneAndUpdate(
      { user: user._id },
      {
        currentWeight,
        achieved,
        achievedAt: achieved && !goal.achieved ? new Date() : goal.achievedAt,
      },
      { new: true }
    );

    // Progress % — how far from start toward target
    const totalChange   = Math.abs(goal.targetWeight - goal.startWeight);
    const currentChange = Math.abs(goal.currentWeight - goal.startWeight);
    const progress      = totalChange === 0
      ? 100
      : Math.min(100, Math.round((currentChange / totalChange) * 100));

    // Days remaining
    const daysRemaining = goal.targetDate
      ? Math.max(0, Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24)))
      : null;

    res.json({ goal, progress, daysRemaining });
  } catch (err) {
    console.error('getGoal error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// DELETE /api/goals?email=   (Pro only)
// ──────────────────────────────────────────────────────────────
export const deleteGoal = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Goal.findOneAndDelete({ user: user._id });
    res.json({ message: 'Goal deleted successfully' });
  } catch (err) {
    console.error('deleteGoal error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
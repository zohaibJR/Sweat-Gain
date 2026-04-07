import Attendance from '../models/Attendence.js';
import User       from '../models/user.js';

export const EXERCISE_OPTIONS = [
  'Chest', 'Biceps', 'Triceps', 'Legs',
  'Back', 'Shoulders', 'Cardio', 'Full Body', 'Arms', 'Core',
];

// ──────────────────────────────────────────────────────────────
// POST /api/exercises/log   (Pro only — guarded by isPro middleware)
// Body: { email, exercises: [] }
// ──────────────────────────────────────────────────────────────
export const logExercises = async (req, res) => {
  try {
    const { email, exercises } = req.body;

    if (!Array.isArray(exercises) || exercises.length === 0)
      return res.status(400).json({ message: 'Exercises array required' });

    const invalid = exercises.filter(e => !EXERCISE_OPTIONS.includes(e));
    if (invalid.length > 0)
      return res.status(400).json({ message: `Invalid exercises: ${invalid.join(', ')}` });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await Attendance.findOneAndUpdate(
      { user: user._id, date: today },
      { exercises },
      { new: true }
    );

    if (!record)
      return res.status(400).json({ message: 'Mark attendance first before logging exercises' });

    res.json({ message: 'Exercises logged successfully', exercises: record.exercises });
  } catch (err) {
    console.error('logExercises error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// GET /api/exercises/history?email=&days=30  (Pro only)
// ──────────────────────────────────────────────────────────────
export const getExerciseHistory = async (req, res) => {
  try {
    const { email, days = 30 } = req.query;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));
    since.setHours(0, 0, 0, 0);

    const records = await Attendance.find({
      user:      user._id,
      date:      { $gte: since },
      status:    'Present',
      exercises: { $exists: true, $not: { $size: 0 } },
    }).sort({ date: -1 });

    res.json(records.map(r => ({
      date:          r.date,
      formattedDate: new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      exercises:     r.exercises,
    })));
  } catch (err) {
    console.error('getExerciseHistory error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// GET /api/exercises/muscle-stats?email=  (Pro only)
// Returns per-muscle frequency for last 30 days
// ──────────────────────────────────────────────────────────────
export const getMuscleGroupStats = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const since = new Date();
    since.setDate(since.getDate() - 30);
    since.setHours(0, 0, 0, 0);

    const records = await Attendance.find({
      user:   user._id,
      date:   { $gte: since },
      status: 'Present',
    });

    // Initialise all to zero then count
    const counts = Object.fromEntries(EXERCISE_OPTIONS.map(e => [e, 0]));

    records.forEach(r => {
      (r.exercises || []).forEach(ex => {
        if (counts[ex] !== undefined) counts[ex]++;
      });
    });

    const sorted = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const mostTrained = sorted[0]?.count > 0 ? sorted[0].name : null;

    res.json({ stats: sorted, mostTrained, totalWorkouts: records.length });
  } catch (err) {
    console.error('getMuscleGroupStats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// GET /api/exercises/weekly?email=  (Pro only)
// Last 7 days with per-day exercise list
// ──────────────────────────────────────────────────────────────
export const getWeeklyWorkoutSummary = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const today = new Date(); today.setHours(23, 59, 59, 999);
    const sevenAgo = new Date(); sevenAgo.setDate(sevenAgo.getDate() - 6); sevenAgo.setHours(0, 0, 0, 0);

    const records = await Attendance.find({
      user: user._id,
      date: { $gte: sevenAgo, $lte: today },
    }).sort({ date: 1 });

    const summary = records.map(r => ({
      date:          r.date,
      day:           new Date(r.date).toLocaleDateString('en-US', { weekday: 'short' }),
      status:        r.status,
      exercises:     r.exercises || [],
      exerciseCount: (r.exercises || []).length,
    }));

    const workoutDays = summary.filter(d => d.status === 'Present' && d.exerciseCount > 0).length;

    res.json({ summary, workoutDays, totalDays: 7 });
  } catch (err) {
    console.error('getWeeklyWorkoutSummary error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// GET /api/exercises/options  (public — used by frontend selector)
// ──────────────────────────────────────────────────────────────
export const getExerciseOptions = (req, res) => {
  res.json({ exercises: EXERCISE_OPTIONS });
};
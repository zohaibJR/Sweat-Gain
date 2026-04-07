import Attendance from '../models/Attendence.js';
import User       from '../models/user.js';
import { autoFillAbsentDays } from '../utils/autoFillAttendance.js';

const fmtDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

// ──────────────────────────────────────────────────────────────
// POST /api/attendance/mark
// Body: { email, status, weight }
// ──────────────────────────────────────────────────────────────
export const submitAttendance = async (req, res) => {
  try {
    const { email, status, weight } = req.body;

    if (!email || !status || weight === undefined)
      return res.status(400).json({ message: 'All fields are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Back-fill any missing days before saving today
    await autoFillAbsentDays(user._id);

    const alreadyMarked = await Attendance.findOne({ user: user._id, date: today });
    if (alreadyMarked)
      return res.status(400).json({ message: 'Attendance already marked today' });

    await Attendance.create({
      user:   user._id,
      date:   today,
      status,
      weight: parseFloat(weight),
      exercises: [], // exercises logged separately by Pro users
    });

    res.status(201).json({ message: 'Attendance submitted successfully' });
  } catch (err) {
    console.error('submitAttendance error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// GET /api/attendance/check-today?email=
// Returns whether user already marked today + exercises (Pro)
// ──────────────────────────────────────────────────────────────
export const checkTodayAttendance = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await Attendance.findOne({ user: user._id, date: today });

    res.json({
      marked:    !!record,
      status:    record ? record.status    : null,
      weight:    record ? record.weight    : null,
      exercises: record ? (record.exercises || []) : [],
    });
  } catch (err) {
    console.error('checkTodayAttendance error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// GET /api/attendance/last7days?email=
// Returns last 7 days of records (for chart)
// ──────────────────────────────────────────────────────────────
export const getLast7DaysWeight = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6);

    const records = await Attendance.find({
      user: user._id,
      date: { $gte: startDate, $lte: today },
    }).sort({ date: 1 });

    res.json(records);
  } catch (err) {
    console.error('getLast7DaysWeight error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// GET /api/attendance/last7days/weight-records?email=
// ──────────────────────────────────────────────────────────────
export const getLast7DaysWeightRecords = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const today       = new Date(); today.setHours(0, 0, 0, 0);
    const signupDate  = new Date(user.createdAt); signupDate.setHours(0, 0, 0, 0);
    const sevenAgo    = new Date(today); sevenAgo.setDate(today.getDate() - 6);
    const startDate   = signupDate > sevenAgo ? signupDate : sevenAgo;

    const records = await Attendance.find({
      user: user._id,
      date: { $gte: startDate, $lte: today },
    }).sort({ date: -1 });

    res.json(records.map(r => ({ date: fmtDate(r.date), weight: r.weight })));
  } catch (err) {
    console.error('getLast7DaysWeightRecords error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// GET /api/attendance/last7days/attendance-records?email=
// ──────────────────────────────────────────────────────────────
export const getLast7DaysAttendanceRecords = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const today      = new Date(); today.setHours(0, 0, 0, 0);
    const signupDate = new Date(user.createdAt); signupDate.setHours(0, 0, 0, 0);
    const sevenAgo   = new Date(today); sevenAgo.setDate(today.getDate() - 6);
    const startDate  = signupDate > sevenAgo ? signupDate : sevenAgo;

    const records = await Attendance.find({
      user: user._id,
      date: { $gte: startDate, $lte: today },
    }).sort({ date: -1 });

    res.json(records.map(r => ({ date: fmtDate(r.date), status: r.status })));
  } catch (err) {
    console.error('getLast7DaysAttendanceRecords error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// GET /api/attendance/latest?email=
// ──────────────────────────────────────────────────────────────
export const getLatestWeight = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const latest = await Attendance.findOne({ user: user._id }).sort({ date: -1 }).select('weight');
    res.json({ weight: latest ? latest.weight : null });
  } catch (err) {
    console.error('getLatestWeight error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// GET /api/attendance/weight-change?email=
// ──────────────────────────────────────────────────────────────
export const getWeightChange = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const records = await Attendance.find({ user: user._id }).sort({ date: 1 });

    if (records.length < 2)
      return res.json({ change: 0, firstWeight: records[0]?.weight || 0, latestWeight: records[0]?.weight || 0 });

    const firstWeight  = records[0].weight;
    const latestWeight = records[records.length - 1].weight;
    res.json({ firstWeight, latestWeight, change: latestWeight - firstWeight });
  } catch (err) {
    console.error('getWeightChange error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// GET /api/attendance/monthly?email=
// ──────────────────────────────────────────────────────────────
export const getMonthlyAttendance = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const now          = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const totalDays    = endOfMonth.getDate();

    const presentCount = await Attendance.countDocuments({
      user: user._id, status: 'Present',
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    res.json({
      totalDays,
      presentCount,
      month: now.toLocaleString('default', { month: 'long' }),
    });
  } catch (err) {
    console.error('getMonthlyAttendance error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// GET /api/attendance/monthly/pie?email=
// ──────────────────────────────────────────────────────────────
export const getMonthlyAttendancePie = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const now          = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const totalDays    = endOfMonth.getDate();

    const presentCount = await Attendance.countDocuments({
      user: user._id, status: 'Present',
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    res.json({
      presentCount,
      absentCount: totalDays - presentCount,
      totalDays,
      month: now.toLocaleString('default', { month: 'long' }),
    });
  } catch (err) {
    console.error('getMonthlyAttendancePie error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// GET /api/attendance/last10days/pie?email=
// ──────────────────────────────────────────────────────────────
export const getLast10DaysAttendancePie = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const firstAtt       = await Attendance.findOne({ user: user._id }).sort({ date: 1 });
    const registrationDate = firstAtt ? new Date(firstAtt.date) : new Date(user.createdAt);
    registrationDate.setHours(0, 0, 0, 0);

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tenAgo = new Date(today); tenAgo.setDate(today.getDate() - 9);
    const startDate = registrationDate > tenAgo ? registrationDate : tenAgo;

    const records = await Attendance.find({
      user: user._id,
      date: { $gte: startDate, $lte: today },
    });

    const totalDays    = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const presentCount = records.filter(r => r.status === 'Present').length;

    res.json({ totalDays, presentCount, absentCount: totalDays - presentCount });
  } catch (err) {
    console.error('getLast10DaysAttendancePie error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ──────────────────────────────────────────────────────────────
// GET /api/attendance/monthly/records?email=&month=&year=
// ──────────────────────────────────────────────────────────────
export const getMonthlyRecords = async (req, res) => {
  try {
    const { email, month, year } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const now         = new Date();
    const targetYear  = year  ? parseInt(year)  : now.getFullYear();
    const targetMonth = month !== undefined ? parseInt(month) : now.getMonth();

    const startOfMonth = new Date(targetYear, targetMonth, 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(targetYear, targetMonth + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const records = await Attendance.find({
      user: user._id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    }).sort({ date: -1 });

    const result = records.map(r => ({
      date:          r.date,
      formattedDate: fmtDate(r.date),
      dayName:       new Date(r.date).toLocaleDateString('en-US', { weekday: 'long' }),
      status:        r.status,
      weight:        r.weight,
      exercises:     r.exercises || [],
    }));

    const presentCount = result.filter(r => r.status === 'Present').length;
    const absentCount  = result.filter(r => r.status === 'Absent').length;

    res.json({
      records: result,
      summary: {
        totalRecords: result.length,
        presentCount,
        absentCount,
        month: startOfMonth.toLocaleString('default', { month: 'long' }),
        year:  targetYear,
      },
    });
  } catch (err) {
    console.error('getMonthlyRecords error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
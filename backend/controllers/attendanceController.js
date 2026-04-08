import Attendance from '../models/Attendence.js';
import User from '../models/user.js';
import {
  endOfDay,
  ensureAttendanceThroughDate,
  ensureTodayAttendance,
  isRecordEditable,
  startOfDay,
} from '../utils/autoFillAttendance.js';

const fmtDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const getUserByEmail = async (email) => {
  if (!email) return null;
  return User.findOne({ email: email.toLowerCase() });
};

const getCurrentState = (record) => ({
  marked: !!record,
  status: record?.status ?? null,
  weight: record?.weight ?? null,
  exercises: record?.exercises ?? [],
  source: record?.source ?? null,
  checkedInAt: record?.checkedInAt ?? null,
  editableUntil: record?.editableUntil ?? null,
  canCheckIn: !!record && record.status === 'Absent' && isRecordEditable(record),
});

export const submitAttendance = async (req, res) => {
  try {
    const { email, weight, exercises = [] } = req.body;

    if (!email || weight === undefined) {
      return res.status(400).json({ message: 'Email and weight are required' });
    }

    const parsedWeight = Number.parseFloat(weight);
    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
      return res.status(400).json({ message: 'Enter a valid weight' });
    }

    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const record = await ensureTodayAttendance(user);
    if (!record) {
      return res.status(500).json({ message: 'Unable to prepare today attendance record' });
    }

    if (record.status === 'Present' && record.source === 'manual') {
      return res.status(400).json({ message: 'Today is already checked in' });
    }

    if (!isRecordEditable(record)) {
      return res.status(400).json({ message: 'The 36 hour update window has ended for this attendance record' });
    }

    record.status = 'Present';
    record.weight = parsedWeight;
    record.source = 'manual';
    record.checkedInAt = new Date();
    record.exercises = Array.isArray(exercises) ? exercises : [];
    await record.save();

    res.status(200).json({
      message: 'Attendance checked in successfully',
      record: getCurrentState(record),
    });
  } catch (err) {
    console.error('submitAttendance error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const checkTodayAttendance = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const record = await ensureTodayAttendance(user);
    res.json(getCurrentState(record));
  } catch (err) {
    console.error('checkTodayAttendance error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLast7DaysWeight = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await ensureAttendanceThroughDate(user, new Date());

    const today = startOfDay(new Date());
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

export const getLast7DaysWeightRecords = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await ensureAttendanceThroughDate(user, new Date());

    const today = startOfDay(new Date());
    const signupDate = startOfDay(user.createdAt);
    const sevenAgo = new Date(today);
    sevenAgo.setDate(today.getDate() - 6);
    const startDate = signupDate > sevenAgo ? signupDate : sevenAgo;

    const records = await Attendance.find({
      user: user._id,
      date: { $gte: startDate, $lte: today },
    }).sort({ date: -1 });

    res.json(records.map((r) => ({ date: fmtDate(r.date), weight: r.weight })));
  } catch (err) {
    console.error('getLast7DaysWeightRecords error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLast7DaysAttendanceRecords = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await ensureAttendanceThroughDate(user, new Date());

    const today = startOfDay(new Date());
    const signupDate = startOfDay(user.createdAt);
    const sevenAgo = new Date(today);
    sevenAgo.setDate(today.getDate() - 6);
    const startDate = signupDate > sevenAgo ? signupDate : sevenAgo;

    const records = await Attendance.find({
      user: user._id,
      date: { $gte: startDate, $lte: today },
    }).sort({ date: -1 });

    res.json(records.map((r) => ({ date: fmtDate(r.date), status: r.status })));
  } catch (err) {
    console.error('getLast7DaysAttendanceRecords error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLatestWeight = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await ensureAttendanceThroughDate(user, new Date());

    const latest = await Attendance.findOne({ user: user._id }).sort({ date: -1 }).select('weight');
    res.json({ weight: latest ? latest.weight : null });
  } catch (err) {
    console.error('getLatestWeight error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getWeightChange = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await ensureAttendanceThroughDate(user, new Date());

    const records = await Attendance.find({ user: user._id }).sort({ date: 1 });

    if (records.length < 2) {
      return res.json({ change: 0, firstWeight: records[0]?.weight || 0, latestWeight: records[0]?.weight || 0 });
    }

    const firstWeight = records[0].weight;
    const latestWeight = records[records.length - 1].weight;
    res.json({ firstWeight, latestWeight, change: latestWeight - firstWeight });
  } catch (err) {
    console.error('getWeightChange error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMonthlyAttendance = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await ensureAttendanceThroughDate(user, new Date());

    const now = new Date();
    const startOfMonth = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
    const endOfMonth = endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    const totalDays = Math.min(
      new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(),
      now.getDate()
    );

    const presentCount = await Attendance.countDocuments({
      user: user._id,
      status: 'Present',
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

export const getMonthlyAttendancePie = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await ensureAttendanceThroughDate(user, new Date());

    const now = new Date();
    const startOfMonth = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
    const endOfMonth = endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    const totalDays = Math.min(
      new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(),
      now.getDate()
    );

    const presentCount = await Attendance.countDocuments({
      user: user._id,
      status: 'Present',
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

export const getLast10DaysAttendancePie = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await ensureAttendanceThroughDate(user, new Date());

    const today = startOfDay(new Date());
    const tenAgo = new Date(today);
    tenAgo.setDate(today.getDate() - 9);
    const registrationDate = startOfDay(user.createdAt);
    const startDate = registrationDate > tenAgo ? registrationDate : tenAgo;

    const records = await Attendance.find({
      user: user._id,
      date: { $gte: startDate, $lte: today },
    });

    const totalDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const presentCount = records.filter((r) => r.status === 'Present').length;

    res.json({ totalDays, presentCount, absentCount: totalDays - presentCount });
  } catch (err) {
    console.error('getLast10DaysAttendancePie error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMonthlyRecords = async (req, res) => {
  try {
    const { email, month, year } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const now = new Date();
    const targetYear = year ? Number.parseInt(year, 10) : now.getFullYear();
    const targetMonth = month !== undefined ? Number.parseInt(month, 10) : now.getMonth();
    const currentMonthRequested = targetYear === now.getFullYear() && targetMonth === now.getMonth();

    if (currentMonthRequested) {
      await ensureAttendanceThroughDate(user, now);
    }

    const startOfMonth = startOfDay(new Date(targetYear, targetMonth, 1));
    const monthEndDate = new Date(targetYear, targetMonth + 1, 0);
    const endOfMonth = currentMonthRequested ? endOfDay(now) : endOfDay(monthEndDate);

    const records = await Attendance.find({
      user: user._id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    }).sort({ date: -1 });

    const result = records.map((r) => ({
      id: r._id,
      date: r.date,
      formattedDate: fmtDate(r.date),
      dayName: new Date(r.date).toLocaleDateString('en-US', { weekday: 'long' }),
      status: r.status,
      weight: r.weight,
      source: r.source,
      checkedInAt: r.checkedInAt,
      editableUntil: r.editableUntil,
      canCheckIn: r.status === 'Absent' && isRecordEditable(r),
      exercises: r.exercises || [],
    }));

    const presentCount = result.filter((r) => r.status === 'Present').length;
    const absentCount = result.filter((r) => r.status === 'Absent').length;

    res.json({
      records: result,
      summary: {
        totalRecords: result.length,
        presentCount,
        absentCount,
        month: startOfMonth.toLocaleString('default', { month: 'long' }),
        year: targetYear,
      },
    });
  } catch (err) {
    console.error('getMonthlyRecords error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


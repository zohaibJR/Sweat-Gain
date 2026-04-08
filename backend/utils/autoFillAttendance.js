import Attendance from '../models/Attendence.js';

const EDIT_WINDOW_HOURS = 36;

export const startOfDay = (value = new Date()) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const endOfDay = (value = new Date()) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
};

export const getEditableUntil = (date) =>
  new Date(startOfDay(date).getTime() + EDIT_WINDOW_HOURS * 60 * 60 * 1000);

export const isRecordEditable = (record, now = new Date()) => {
  if (!record?.editableUntil) return false;
  return new Date(record.editableUntil) >= now;
};

const buildAutoAbsentRecord = ({ userId, date, weight }) => ({
  user: userId,
  date: startOfDay(date),
  status: 'Absent',
  weight,
  source: 'auto',
  editableUntil: getEditableUntil(date),
  checkedInAt: null,
  exercises: [],
});

export const ensureAttendanceThroughDate = async (user, targetDate = new Date()) => {
  const today = startOfDay(targetDate);
  const signupDate = startOfDay(user.createdAt);

  let lastRecord = await Attendance.findOne({ user: user._id }).sort({ date: -1 });
  let cursor = lastRecord ? startOfDay(lastRecord.date) : new Date(signupDate);
  let carryWeight = lastRecord?.weight ?? 0;

  if (lastRecord) {
    cursor.setDate(cursor.getDate() + 1);
  }

  while (cursor <= today) {
    try {
      const created = await Attendance.create(
        buildAutoAbsentRecord({ userId: user._id, date: cursor, weight: carryWeight })
      );
      carryWeight = created.weight;
    } catch (error) {
      if (error.code !== 11000) {
        throw error;
      }
    }

    cursor.setDate(cursor.getDate() + 1);
  }
};

export const ensureTodayAttendance = async (user) => {
  await ensureAttendanceThroughDate(user, new Date());
  return Attendance.findOne({ user: user._id, date: startOfDay(new Date()) });
};


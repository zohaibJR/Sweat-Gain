import Attendance from '../models/Attendence.js';

/**
 * Auto-fills missing attendance days between the last recorded day and today.
 *
 * Rules:
 *  - Sunday  → mark as Present  (rest day), carry last known weight
 *  - Mon–Sat → mark as Absent,              carry last known weight
 *
 * Called when a user submits attendance so there are no gaps in their history.
 */
export const autoFillAbsentDays = async (userId) => {
  try {
    const lastAttendance = await Attendance.findOne({ user: userId }).sort({ date: -1 });
    if (!lastAttendance) return; // No previous record — nothing to backfill

    const lastDate = new Date(lastAttendance.date);
    lastDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start from the day AFTER the last recorded date
    let current     = new Date(lastDate);
    let carryWeight = lastAttendance.weight;
    current.setDate(current.getDate() + 1);

    while (current < today) {
      const dayOfWeek = current.getDay(); // 0 = Sunday
      const status    = dayOfWeek === 0 ? 'Present' : 'Absent';

      try {
        await Attendance.create({
          user:   userId,
          date:   new Date(current),
          status,
          weight: carryWeight,
        });
        console.log(`📅 Auto-filled [${status}] for user ${userId} on ${current.toDateString()} — weight: ${carryWeight}kg`);
      } catch (err) {
        if (err.code !== 11000) {
          // 11000 = duplicate key (already exists) — safe to skip
          console.error(`Auto-fill error on ${current.toDateString()}:`, err.message);
        }
      }

      current.setDate(current.getDate() + 1);
    }
  } catch (err) {
    console.error('autoFillAbsentDays error:', err);
  }
};
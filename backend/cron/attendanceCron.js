import cron from 'node-cron';
import User       from '../models/user.js';
import Attendance from '../models/Attendence.js';

/**
 * Runs every night at 23:59.
 * For every user that hasn't submitted today:
 *   - Sunday  → auto-mark Present  (rest day)
 *   - Mon–Sat → auto-mark Absent
 * Carries forward last known weight in both cases.
 */
cron.schedule('59 23 * * *', async () => {
  console.log('⏰ [CRON] Running end-of-day attendance fill...');

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayOfWeek = today.getDay(); // 0 = Sunday

    // Only process non-admin users
    const users = await User.find({ isAdmin: { $ne: true } });

    for (const user of users) {
      // Skip if already marked today
      const alreadyMarked = await Attendance.findOne({ user: user._id, date: today });
      if (alreadyMarked) {
        console.log(`⏭️  Skipping ${user.email} — already marked today`);
        continue;
      }

      // Carry forward last known weight
      const lastRecord  = await Attendance.findOne({ user: user._id }).sort({ date: -1 });
      const carryWeight = lastRecord ? lastRecord.weight : 0;

      const status = dayOfWeek === 0 ? 'Present' : 'Absent';

      await Attendance.create({
        user:   user._id,
        date:   today,
        status,
        weight: carryWeight,
      });

      const icon = dayOfWeek === 0 ? '✅' : '❌';
      console.log(`${icon} Auto-marked [${status}] for ${user.email} — weight: ${carryWeight}kg`);
    }

    console.log('✅ [CRON] End-of-day attendance fill complete.');
  } catch (err) {
    console.error('❌ [CRON] Error:', err);
  }
});
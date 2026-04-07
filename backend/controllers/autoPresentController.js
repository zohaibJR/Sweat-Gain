import cron from 'node-cron';
import User from '../models/user.js';
import Attendance from '../models/Attendence.js';

// ⏰ Run every Sunday at 00:01 AM
cron.schedule('1 0 * * 0', async () => {
  console.log('🕛 Running auto Present for Sunday');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const users = await User.find();

    for (const user of users) {
      // Check if attendance already exists for today
      const alreadyMarked = await Attendance.findOne({ user: user._id, date: today });
      if (alreadyMarked) continue;

      // Get last attendance record (most recent before today)
      const lastAttendance = await Attendance.findOne({ user: user._id })
        .sort({ date: -1 }); // latest first

      if (!lastAttendance) {
        // If user has no previous attendance, skip or set weight = 0
        continue;
      }

      await Attendance.create({
        user: user._id,
        date: today,
        status: 'Present',
        weight: lastAttendance.weight
      });

      console.log(`✅ Auto Present marked for ${user.email} with weight ${lastAttendance.weight}`);
    }
  } catch (error) {
    console.error('Auto Present Cron Error:', error);
  }
});

export default {}; // No export needed, just cron runs

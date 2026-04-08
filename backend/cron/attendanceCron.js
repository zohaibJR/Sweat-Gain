import cron from 'node-cron';
import User from '../models/user.js';
import { ensureAttendanceThroughDate } from '../utils/autoFillAttendance.js';

cron.schedule('5 0 * * *', async () => {
  console.log('[CRON] Preparing daily absent placeholders...');

  try {
    const users = await User.find({ isAdmin: { $ne: true } });

    for (const user of users) {
      await ensureAttendanceThroughDate(user, new Date());
    }

    console.log('[CRON] Daily absent placeholders are ready.');
  } catch (error) {
    console.error('[CRON] Attendance preparation error:', error);
  }
});


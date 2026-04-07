import express from 'express';
import {
  submitAttendance,
  checkTodayAttendance,
  getLast7DaysWeight,
  getLast7DaysWeightRecords,
  getLast7DaysAttendanceRecords,
  getLast10DaysAttendancePie,
  getLatestWeight,
  getWeightChange,
  getMonthlyAttendance,
  getMonthlyAttendancePie,
  getMonthlyRecords,
} from '../controllers/attendanceController.js';

const router = express.Router();

// Submit attendance  (AttendenceForm uses POST /api/attendance/mark)
router.post('/',      submitAttendance);
router.post('/mark',  submitAttendance); // alias used by frontend

// Check today
router.get('/check-today', checkTodayAttendance);

// Weight data
router.get('/last7days',                   getLast7DaysWeight);
router.get('/last7days/weight-records',    getLast7DaysWeightRecords);
router.get('/last7days/attendance-records',getLast7DaysAttendanceRecords);
router.get('/last10days/pie',              getLast10DaysAttendancePie);
router.get('/latest',                      getLatestWeight);
router.get('/weight-change',               getWeightChange);

// Monthly
router.get('/monthly',         getMonthlyAttendance);
router.get('/monthly/pie',     getMonthlyAttendancePie);
router.get('/monthly/records', getMonthlyRecords);

export default router;
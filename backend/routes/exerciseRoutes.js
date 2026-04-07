import express from 'express';
import isPro   from '../middleware/isPro.js';
import {
  logExercises,
  getExerciseHistory,
  getMuscleGroupStats,
  getWeeklyWorkoutSummary,
  getExerciseOptions,
} from '../controllers/exerciseController.js';

const router = express.Router();

// Public — frontend needs options list even before Pro check
router.get('/options', getExerciseOptions);

// Pro-only routes
router.post('/log',          isPro, logExercises);
router.get('/history',       isPro, getExerciseHistory);
router.get('/muscle-stats',  isPro, getMuscleGroupStats);
router.get('/weekly',        isPro, getWeeklyWorkoutSummary);

export default router;
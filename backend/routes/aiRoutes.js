import express from 'express';
import { suggestWorkout } from '../controllers/aiController.js';

const router = express.Router();

router.get('/suggest-workout', suggestWorkout);

export default router;

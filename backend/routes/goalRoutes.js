import express from 'express';
import isPro   from '../middleware/isPro.js';
import { setGoal, getGoal, deleteGoal } from '../controllers/goalController.js';

const router = express.Router();

router.post('/',   isPro, setGoal);
router.get('/',    isPro, getGoal);
router.delete('/', isPro, deleteGoal);

export default router;
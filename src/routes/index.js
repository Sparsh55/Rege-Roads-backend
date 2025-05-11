import { Router } from 'express';
import { login } from '../controller/userLogin.js';
import { getLeaderboard } from '../controller/leaderboard.js';
import { updateGameData } from '../controller/Game.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/login', login);

// Protected routes (JWT required)
router.get('/leaderboard', verifyToken, getLeaderboard);
router.post('/update/game-data', verifyToken, updateGameData);

export default router;
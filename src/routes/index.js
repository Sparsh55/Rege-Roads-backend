import { Router } from 'express';
import { login } from '../controller/userLogin.js';
import { getLeaderboard } from '../controller/leaderboard.js';
import { updateGameData } from '../controller/Game.js';
import { verifyToken } from '../middleware/auth.js';
import nodeCron from '../utils/nodeCron.js';

const router = Router();

const { distributeRewards } = nodeCron;
// Public routes
router.post('/login', login);

//test route for manually trigger cronjob logic for testing purpose
router.get("/test-rewards", async (req, res) => {
  await distributeRewards();
  res.send("Rewards distributed manually");
});

// Protected routes (JWT required)
router.get('/leaderboard', verifyToken, getLeaderboard);
router.post('/update/game-data', verifyToken, updateGameData);

export default router;
import { Router } from "express";
import { login } from "../controller/userLogin.js";
import { getLeaderboard } from "../controller/leaderboard.js";
import { updateGameData, getGameConfiguration } from "../controller/Game.js";
import { verifyToken } from "../middleware/auth.js";
import nodeCron from "../utils/nodeCron.js";
import RewardLog from "../model/Rewardlog.js";
import { getWeekRange } from "../utils/nodeCron.js";

const router = Router();
const { distributeRewards } = nodeCron;

// Public routes
router.post("/login", login);

// Test route for manually trigger cronjob logic
router.get("/test-rewards", async (req, res) => {
  const { start, end } = getWeekRange();

  const already = await RewardLog.findOne({
    distributedAt: { $gte: start, $lte: end },
  });

  if (already) {
    return res
      .status(400)
      .json({ message: "Rewards already distributed this week" });
  }

  await distributeRewards();
  res.send("Rewards distributed manually");
});

// Protected routes
router.get("/leaderboard", verifyToken, getLeaderboard);
router.post("/update/game-data", verifyToken, updateGameData);
router.get("/game-configuration/:wallet", verifyToken, getGameConfiguration);

export default router;

import cron from 'node-cron';
import User from '../model/User.js';
import mongoose from 'mongoose';
import cronConfig from '../config/cronConfig.js';
import Rewardlog from '../model/Rewardlog.js';


// Track execution state
const executionState = {
  lastRun: null,
  isRunning: false
};

// Helper: Get start and end of current ISO week
 export const getWeekRange = () => {
  const now = new Date();
  const start = new Date(now);
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when Sunday
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

// Main distribution logic
const distributeRewards = async () => {
  if (executionState.isRunning) {
    console.log('Reward distribution already in progress');
    return;
  }

  executionState.isRunning = true;

  try {
    const { start, end } = getWeekRange();

    const alreadyDistributed = await Rewardlog.findOne({
      distributedAt: { $gte: start, $lte: end }
    });

    if (alreadyDistributed) {
      console.log('Rewards already distributed this week');
      return;
    }

    console.log('Starting weekly reward distribution...');

    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const topPlayers = await User.find()
        .sort({ score: -1 })
        .limit(10)
        .session(session);

      await Promise.all(topPlayers.map(player => {
        player.tokensEarned += 100;
        player.lastWeekScore = player.score;
        return player.save({ session });
      }));

      //  Save log entry after success
      await Rewardlog.create([{ distributedAt: new Date() }], { session });
    });

    console.log('Weekly rewards distributed successfully');
  } catch (err) {
    console.error('Error during reward distribution:', err);
  } finally {
    executionState.isRunning = false;
  }
};
// Schedule the job with dynamic day from config
const scheduleJob = () => {
  const { rewardDistributionDay, rewardHour, rewardMinute } = cronConfig;
  
  // Convert day number to cron syntax (0-6 where 0=Sunday)
  const dayOfWeek = rewardDistributionDay % 7;
  
  // Safety check: Run daily but only execute on configured day
  cron.schedule(`${rewardMinute} ${rewardHour} * * *`, () => {
    const now = new Date();
    if (now.getDay() === dayOfWeek) {
      // Check if we already ran this week
      if (!executionState.lastRun || !isSameWeek(executionState.lastRun, now)) {
        distributeRewards();
      }
    }
  });

  console.log(`Scheduled weekly rewards for day ${dayOfWeek} at ${rewardHour}:${rewardMinute}`);
};

// Initialize on server start
const init = async () => {
  // Find most recent execution from database
  const lastUpdatedUser = await User.findOne().sort({ updatedAt: -1 });
  if (lastUpdatedUser) {
    executionState.lastRun = lastUpdatedUser.updatedAt;
  }
  
  scheduleJob();
};

init();

export default {
  distributeRewards, // Exported for manual triggering
  scheduleJob,
};
import cron from 'node-cron';
import User from '../model/User.js';
import mongoose from 'mongoose';
import cronConfig from '../config/cronConfig.js';

// Track execution state
const executionState = {
  lastRun: null,
  isRunning: false
};

// Helper: Check if two dates are in the same week
const isSameWeek = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.abs(d1 - d2) < (7 * oneDay) && 
         d1.getDay() === d2.getDay();
};

// Main distribution logic
const distributeRewards = async () => {
  if (executionState.isRunning) {
    console.log('Distribution already in progress');
    return;
  }

  executionState.isRunning = true;
  const today = new Date();

  try {
    console.log(`Starting weekly rewards for ${today.toISOString()}`);
    
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
    });

    executionState.lastRun = today;
    console.log('Weekly rewards distributed successfully');
  } catch (err) {
    console.error('Reward distribution failed:', err);
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
  scheduleJob
};
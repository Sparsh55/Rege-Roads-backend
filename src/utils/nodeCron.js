import cron from 'node-cron';
import User from '../models/User.js';

cron.schedule('0 0 * * 0', async () => { // Runs every Sunday at midnight
  try {
    const topPlayers = await User.find()
      .sort({ score: -1 })
      .limit(10);

    for (const player of topPlayers) {
      player.tokensEarned += 100; // Award tokens
      player.lastWeekScore = player.score; // Freeze score for the week
      await player.save();
    }

    console.log('Weekly rewards distributed to top 10 players');
  } catch (err) {
    console.error('Cron job failed:', err);
  }
});
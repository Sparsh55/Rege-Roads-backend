import Game from '../model/Game.js';
import User from '../model/User.js';
import { getWeekStart } from '../utils/datehelper.js';

export const updateGameData = async (req, res) => {
  const { wallet, track, score, raceTime, isWin = false } = req.body;

  try {
    // 1. Save the game record
    const game = await Game.create({
      playerWallet: wallet,
      track,
      score,
      raceTime,
      isWin
    });

    // 2. Update user's scores and weekly records
     const currentWeekStart = getWeekStart();

    //now for testing purpose simiulate for 8 weeks , commented this once tested 
    //const currentWeekStart = getWeekStart(req.body.testDate);
    
    const user = await User.findOne({ wallet });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Clone the weekly scores array
    let updatedWeeklyScores = [...user.weeklyScores];
    
    // Find index of current week if it exists
    const currentWeekIndex = updatedWeeklyScores.findIndex(entry => 
      entry.weekStart.getTime() === currentWeekStart.getTime()
    );

    // Update or add the current week's score
    if (currentWeekIndex >= 0) {
      // Update existing week
      updatedWeeklyScores[currentWeekIndex].score += score;
      if (isWin) {
        updatedWeeklyScores[currentWeekIndex].wins += 1;
      }
    } else {
      // Add new week entry
      const newEntry = {
        weekStart: currentWeekStart,
        score,
        wins: isWin ? 1 : 0
      };

      // Maintain 8-week rolling window
      if (updatedWeeklyScores.length >= 8) {
        updatedWeeklyScores.shift(); // Remove oldest week
      }
      updatedWeeklyScores.push(newEntry);
    }

    // 3. Update the user document
    const updatedUser = await User.findOneAndUpdate(
      { wallet },
      {
        $inc: {
          score,
          totalWins: isWin ? 1 : 0
        },
        $set: {
          weeklyScores: updatedWeeklyScores
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      game,
      user: {
        wallet: updatedUser.wallet,
        score: updatedUser.score,
        totalWins: updatedUser.totalWins,
        weeklyScores: updatedUser.weeklyScores
      }
    });

  } catch (err) {
    console.error('Error updating game data:', err);
    res.status(500).json({ error: "Failed to update game data" });
  }
};
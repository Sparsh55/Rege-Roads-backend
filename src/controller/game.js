import Game from '../model/Game.js';
import User from '../model/User.js';

export const updateGameData = async (req, res) => {
  const { wallet, track, score, raceTime } = req.body;

  try {
    // Save game data
    const game = await Game.create({ playerWallet: wallet, track, score, raceTime });

    // Update user's total score
    await User.findOneAndUpdate(
      { wallet },
      { $inc: { score } }, // Increment score
      { new: true }
    );

    res.status(200).json({ success: true, game });
  } catch (err) {
    res.status(500).json({ error: "Failed to update game data" });
  }
};
import User from '../model/User.js';
import { generateToken } from '../middleware/auth.js';

export const login = async (req, res) => {
  const { wallet } = req.body;

  try {
    let user = await User.findOne({ wallet });

    // Create user if not exists
    if (!user) {
      user = await User.create({ wallet });
    }

    // Generate JWT token
    const token = generateToken(wallet);

    res.status(200).json({ 
      user: {
        wallet: user.wallet,
        name: user.name,
        score: user.score,
        totalWins: user.totalWins,
        weeklyScores: user.weeklyScores,
        carModel: user.carModel
      }, 
      token 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserStats = async (req, res) => {
  const { wallet } = req.params;

  try {
    const user = await User.findOne({ wallet })
      .select('wallet name score totalWins weeklyScores carModel');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error getting user stats:', err);
    res.status(500).json({ error: "Server error" });
  }
};
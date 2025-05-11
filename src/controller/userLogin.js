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

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
import User from '../model/User.js';

export const getLeaderboard = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const currentLeaderboard = await User.find()
      .sort({ score: -1 })
      .skip(skip)
      .limit(limit);

    const lastWeekWinners = await User.find()
      .sort({ lastWeekScore: -1 })
      .limit(10);

    res.status(200).json({ 
      currentLeaderboard, 
      lastWeekWinners,
      currentPage: page,
      totalPages: Math.ceil(await User.countDocuments() / limit)
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
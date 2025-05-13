import User from '../model/User.js';
import { getWeekStart } from '../utils/datehelper.js';

// Helper function to get start of previous week
 function getLastWeekStart() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return getWeekStart(date);
}

export const getLeaderboard = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    // 1. Current all-time leaderboard
    const currentLeaderboard = await User.find()
      .sort({ score: -1 })
      .skip(skip)
      .limit(limit)
      .select('wallet name score totalWins weeklyScores');

    // 2. Last week's winners (from weeklyScores)
    const lastWeekStart = getLastWeekStart();
    
    const lastWeekWinners = await User.aggregate([
      { $unwind: "$weeklyScores" },
      { $match: { "weeklyScores.weekStart": lastWeekStart } },
      { $sort: { "weeklyScores.score": -1 } },
      { $limit: 10 },
      { $project: {
          wallet: 1,
          name: 1,
          weekScore: "$weeklyScores.score",
          weekWins: "$weeklyScores.wins",
          totalScore: "$score",
          totalWins: "$totalWins"
      }}
    ]);

    // 3. Calculate total pages for pagination
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({ 
      currentLeaderboard, 
      lastWeekWinners,
      currentPage: page,
      totalPages,
      limit
    });
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: "Server error" });
  }
};
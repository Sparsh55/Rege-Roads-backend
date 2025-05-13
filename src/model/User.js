import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  wallet: { type: String, required: true, unique: true },
  name: { type: String, default: 'Racer' },
  score: { type: Number, default: 0 },
  weeklyScores: {
    type: [{
      weekStart: { type: Date, required: true },
      score: { type: Number, default: 0 },
      wins: { type: Number, default: 0 }
    }],
    default: []
  },
  totalWins: { type: Number, default: 0 },
  tokensEarned: { type: Number, default: 0 },
  carModel: { type: String, default: 'f1_2025' },
  upgrades: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

// Add index for better performance on leaderboard queries
UserSchema.index({ score: -1 });
UserSchema.index({ 'weeklyScores.score': -1 });

export default mongoose.model('User', UserSchema);
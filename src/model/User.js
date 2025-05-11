import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  wallet: { type: String, required: true, unique: true },
  name: { type: String, default: 'Racer' },
  score: { type: Number, default: 0 },
  lastWeekScore: { type: Number, default: 0 }, // For weekly rewards
  tokensEarned: { type: Number, default: 0 },
  carModel: { type: String, default: 'f1_2023' },
  upgrades: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  playerWallet: { type: String, required: true },
  track: { type: String, required: true },
  score: { type: Number, required: true },
  raceTime: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Game', GameSchema);
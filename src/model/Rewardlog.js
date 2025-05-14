
import mongoose from 'mongoose';
const rewardLogSchema = new mongoose.Schema({
  distributedAt: Date
});
export default mongoose.model('RewardLog', rewardLogSchema);

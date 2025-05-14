import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  // Player and game result fields
  playerWallet: { type: String, required: true },
  track: { type: String, required: true },
  score: { type: Number, required: true },
  raceTime: { type: Number },
  isWin: { type: Boolean, default: false },

  // Game configuration fields
  buildID: { type: String, default: '' },
  gameName: { type: String, default: '' },
  firstRun: { type: Number, default: 3 }, // 0=false, 1=true
  coins: { type: Number, default: 0 },
  originalResolution: {
    x: { type: Number, default: 1920 },
    y: { type: Number, default: 1080 }
  },
  resQuality: { type: Number, default: 1 }, // 0=Low, 1=Medium, 2=High
  controlType: { type: Number, default: 0 }, // 0=Tilt, 1=Touch, 2=Wheel
  accelSensibility: { type: Number, default: 100 },
  steeringWheelSens: { type: Number, default: 250 },
  carColor0: { type: Number, default: 0 }, // Default color index
  musicVolume: { type: Number, default: 0.7 }, // Range 0.0-1.0
  showPositionUI: { type: Number, default: 3 }, // UI setting
  car0: { type: Number, default: 3 }, // Default car index
  level0: { type: Number, default: 3 }, // Default level
  dynamicCamera: { type: Number, default: 3 }, // Camera setting
  showFPS: { type: Number, default: 0 }, // 0=Off, 1=On

  // Timestamp
  createdAt: { type: Date, default: Date.now }
});

// Index for better query performance
GameSchema.index({ playerWallet: 1 });
GameSchema.index({ createdAt: -1 });

export default mongoose.model('Game', GameSchema);
import Game from "../model/Game.js";
import User from "../model/User.js";
import { getWeekStart } from "../utils/datehelper.js";

export const updateGameData = async (req, res) => {
  // Destructure all possible fields from request body
  const {
    // Core game data
    wallet,
    track,
    score,
    raceTime,
    isWin = false,

    // Game configuration
    buildID,
    gameName,
    firstRun,
    coins,
    originalX,
    originalY,
    resQuality,
    controlType,
    accelSensibility,
    steeringWheelSens,
    carColor0,
    musicVolume,
    showPositionUI,
    car0,
    level0,
    dynamicCamera,
    showFPS,
  } = req.body;

  try {
    // 1. Save the complete game record
    const game = await Game.create({
      playerWallet: wallet,
      track,
      score,
      raceTime,
      isWin,

      // Game configuration
      buildID: buildID || "",
      gameName: gameName || "",
      firstRun: firstRun !== undefined ? firstRun : 3,
      coins: coins || 0,
      originalResolution: {
        x: originalX || 1920,
        y: originalY || 1080,
      },
      resQuality: resQuality !== undefined ? resQuality : 1,
      controlType: controlType !== undefined ? controlType : 0,
      accelSensibility: accelSensibility || 100,
      steeringWheelSens: steeringWheelSens || 250,
      carColor0: carColor0 || 0,
      musicVolume: musicVolume !== undefined ? musicVolume : 0.7,
      showPositionUI: showPositionUI !== undefined ? showPositionUI : 3,
      car0: car0 !== undefined ? car0 : 3,
      level0: level0 !== undefined ? level0 : 3,
      dynamicCamera: dynamicCamera !== undefined ? dynamicCamera : 3,
      showFPS: showFPS !== undefined ? showFPS : 0,
    });

    // 2. Update user's scores and weekly records (existing logic)
    const currentWeekStart = getWeekStart();
    const user = await User.findOne({ wallet });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let updatedWeeklyScores = [...user.weeklyScores];
    const currentWeekIndex = updatedWeeklyScores.findIndex(
      (entry) => entry.weekStart.getTime() === currentWeekStart.getTime()
    );

    if (currentWeekIndex >= 0) {
      updatedWeeklyScores[currentWeekIndex].score += score;
      if (isWin) {
        updatedWeeklyScores[currentWeekIndex].wins += 1;
      }
    } else {
      const newEntry = {
        weekStart: currentWeekStart,
        score,
        wins: isWin ? 1 : 0,
      };

      if (updatedWeeklyScores.length >= 8) {
        updatedWeeklyScores.shift();
      }
      updatedWeeklyScores.push(newEntry);
    }

    // 3. Update the user document
    const updatedUser = await User.findOneAndUpdate(
      { wallet },
      {
        $inc: {
          score,
          totalWins: isWin ? 1 : 0,
          coins: coins || 0, // Also update user's coin balance if provided
        },
        $set: {
          weeklyScores: updatedWeeklyScores,
          // Update user's preferences if they changed
          controlType:
            controlType !== undefined ? controlType : user.controlType,
          carColor0: carColor0 !== undefined ? carColor0 : user.carColor0,
        },
      },
      { new: true }
    );

    // 4. Prepare response
    const response = {
      success: true,
      game: {
        id: game._id,
        track: game.track,
        score: game.score,
        isWin: game.isWin,
        raceTime: game.raceTime,
        createdAt: game.createdAt,
      },
      user: {
        wallet: updatedUser.wallet,
        name: updatedUser.name,
        score: updatedUser.score,
        coins: updatedUser.coins,
        totalWins: updatedUser.totalWins,
      },
      configuration: {
        controlType: game.controlType,
        accelSensibility: game.accelSensibility,
        steeringWheelSens: game.steeringWheelSens,
        musicVolume: game.musicVolume,
        resQuality: game.resQuality,
        showFPS: game.showFPS,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error updating game data:", err);
    res.status(500).json({
      error: "Failed to update game data",
      details: err.message,
    });
  }
};

// Additional controller to get game configuration
export const getGameConfiguration = async (req, res) => {
  const { wallet } = req.params;

  try {
    // Find the most recent game configuration for this player
    const config = await Game.findOne({ playerWallet: wallet }).sort({
      createdAt: -1,
    }).select(`
        buildID gameName firstRun coins originalResolution
        resQuality controlType accelSensibility steeringWheelSens
        carColor0 musicVolume showPositionUI car0 level0
        dynamicCamera showFPS
      `);

    if (!config) {
      return res.status(404).json({
        error: "No game configuration found for this player",
        defaultConfig: getDefaultConfiguration(),
      });
    }

    res.status(200).json(config);
  } catch (err) {
    console.error("Error fetching game configuration:", err);
    res.status(500).json({ error: "Failed to fetch game configuration" });
  }
};

function getDefaultConfiguration() {
  return {
    buildID: "",
    gameName: "",
    firstRun: 3,
    coins: 0,
    originalResolution: { x: 1920, y: 1080 },
    resQuality: 1,
    controlType: 0,
    accelSensibility: 100,
    steeringWheelSens: 250,
    carColor0: 0,
    musicVolume: 0.7,
    showPositionUI: 3,
    car0: 3,
    level0: 3,
    dynamicCamera: 3,
    showFPS: 0,
  };
}

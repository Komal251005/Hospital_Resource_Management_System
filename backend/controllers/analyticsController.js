const DailyData = require('../models/DailyData');
const { runPythonPredict } = require('../utils/pythonBridge');
const logger = require('../middleware/logger');

/**
 * POST /api/analytics/predict
 * Run ML prediction for resource needs given patient count
 */
const predict = async (req, res, next) => {
  try {
    const { patients } = req.body;

    // Fetch last 90 days of historical data for training
    const historicalData = await DailyData.find()
      .sort({ date: -1 })
      .limit(90)
      .lean();

    if (historicalData.length < 5) {
      return res.status(400).json({
        success: false,
        message:
          'Not enough historical data for prediction. At least 5 days of data required. Please seed the database first.',
      });
    }

    // Call Python ML script
    const prediction = await runPythonPredict({ patients, historicalData });

    logger.info(`Prediction generated for ${patients} patients`);

    res.status(200).json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    logger.error(`Prediction failed: ${error.message}`);
    next(error);
  }
};

/**
 * GET /api/analytics/daily
 * Fetch historical daily data for charts (last N days)
 */
const getDailyData = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const limit = Math.min(parseInt(days), 365);

    const data = await DailyData.find()
      .sort({ date: -1 })
      .limit(limit)
      .lean();

    // Return in chronological order
    data.reverse();

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/analytics/daily
 * Record of save daily data entry
 */
const saveDailyData = async (req, res, next) => {
  try {
    const { date, patients, bedsUsed, icuUsed, ventilatorsUsed, emergencyCases, discharges } =
      req.body;

    const entry = await DailyData.findOneAndUpdate(
      { date: new Date(date || Date.now()).setHours(0, 0, 0, 0) },
      {
        patients,
        bedsUsed,
        icuUsed,
        ventilatorsUsed,
        emergencyCases: emergencyCases || 0,
        discharges: discharges || 0,
        recordedBy: req.user._id,
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json({
      success: true,
      message: 'Daily data recorded',
      data: entry,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { predict, getDailyData, saveDailyData };

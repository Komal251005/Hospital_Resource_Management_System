const { spawn } = require('child_process');
const path = require('path');
const DailyData = require('../models/DailyData');

// Ensure python command is available from env, fallback to 'python' or 'python3'
const PYTHON_PATH = process.env.PYTHON_PATH || 'python';

const generateMockHistoricalData = () => {
  // Generate 5 days of realistic dummy data to satisfy the ML model if DB is empty
  const mockData = [];
  for (let i = 5; i > 0; i--) {
    const basePatients = 100 + Math.floor(Math.random() * 20); // 100-120
    mockData.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      patients: basePatients,
      bedsUsed: Math.floor(basePatients * 0.8), // 80% of patients need beds
      icuUsed: Math.floor(basePatients * 0.1), // 10% need ICU
      ventilatorsUsed: Math.floor(basePatients * 0.05), // 5% need ventilators
    });
  }
  return mockData;
};

/**
 * @desc    Generate ML predictions for resource demands
 * @route   POST /api/predict
 * @access  Private
 */
const getPrediction = async (req, res, next) => {
  try {
    const { patients } = req.body;

    if (!patients || patients < 0) {
      return res.status(400).json({ success: false, message: 'Invalid patient count provided.' });
    }

    // Attempt to fetch actual historical data from the database
    let historicalData = await DailyData.find().sort({ date: -1 }).limit(10).lean();

    // Map and reverse so oldest is first (assuming DB returned newest first)
    historicalData = historicalData.reverse().map((record) => ({
      date: record.date.toISOString(),
      patients: record.patients,
      bedsUsed: record.bedsUsed,
      icuUsed: record.icuUsed,
      ventilatorsUsed: record.ventilatorsUsed,
    }));

    // ML script needs at least 5 points to train the polynomial regression
    if (historicalData.length < 5) {
      console.warn('Insufficient historical data in DB. Falling back to mock data for ML model.');
      historicalData = generateMockHistoricalData();
    }

    const payload = {
      patients: parseInt(patients, 10),
      historicalData,
    };

    // Path to the Python script
    const pyScriptPath = path.join(__dirname, '..', 'ml', 'predict.py');

    // Spawn Python process
    const pythonProcess = spawn(PYTHON_PATH, [pyScriptPath]);

    let dataString = '';
    let errorString = '';

    // Pass data to python via stdin
    pythonProcess.stdin.write(JSON.stringify(payload));
    pythonProcess.stdin.end();

    // Collect data from python stdout
    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    // Collect errors from python stderr
    pythonProcess.stderr.on('data', (data) => {
      errorString += data.toString();
    });

    // Handle python process completion
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python Script Error:', errorString);
        return res.status(500).json({
          success: false,
          message: 'Error executing prediction model.',
          error: errorString || 'Unknown error occurred in ML service',
        });
      }

      try {
        const predictionResult = JSON.parse(dataString);

        // ML script handles its own internal errors gracefully via JSON {"error": "..."}
        if (predictionResult.error) {
          return res.status(400).json({
            success: false,
            message: predictionResult.error,
          });
        }

        res.status(200).json({
          success: true,
          data: predictionResult,
        });
      } catch (parseError) {
        console.error('Failed to parse Python output:', dataString);
        res.status(500).json({
          success: false,
          message: 'Failed to process ML prediction response.',
        });
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPrediction,
};

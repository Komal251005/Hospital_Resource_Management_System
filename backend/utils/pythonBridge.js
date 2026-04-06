const { spawn } = require('child_process');
const path = require('path');
const logger = require('../middleware/logger');

const PYTHON_SCRIPT = path.join(__dirname, '..', 'ml', 'predict.py');
const PYTHON_CMD = process.env.PYTHON_PATH || 'python';
const TIMEOUT_MS = 30000; // 30 seconds

/**
 * Calls the Python ML prediction script via child_process.spawn
 * @param {Object} payload - { patients: number, historicalData: Array }
 * @returns {Promise<Object>} Prediction result from Python
 */
const runPythonPredict = (payload) => {
  return new Promise((resolve, reject) => {
    logger.info(`Spawning Python: ${PYTHON_CMD} ${PYTHON_SCRIPT}`);

    const pythonProcess = spawn(PYTHON_CMD, [PYTHON_SCRIPT], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    // Set timeout
    const timeout = setTimeout(() => {
      pythonProcess.kill('SIGTERM');
      reject(new Error('Python prediction timed out after 30 seconds'));
    }, TIMEOUT_MS);

    // Collect stdout
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    // Collect stderr (Python warnings / tracebacks)
    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    // On close
    pythonProcess.on('close', (code) => {
      clearTimeout(timeout);

      if (stderr) {
        logger.warn(`Python stderr: ${stderr.trim()}`);
      }

      if (code !== 0) {
        logger.error(`Python exited with code ${code}: ${stderr}`);
        return reject(new Error(`Python process exited with code ${code}: ${stderr.trim()}`));
      }

      try {
        const result = JSON.parse(stdout.trim());

        if (result.error) {
          return reject(new Error(result.error));
        }

        logger.info('Python prediction successful');
        resolve(result);
      } catch (parseError) {
        logger.error(`Failed to parse Python output: ${stdout}`);
        reject(new Error('Python returned invalid JSON output'));
      }
    });

    // On spawn error (e.g., python not found)
    pythonProcess.on('error', (err) => {
      clearTimeout(timeout);
      if (err.code === 'ENOENT') {
        reject(
          new Error(
            `Python executable not found. Set PYTHON_PATH in .env (e.g., python3 or C:\\Python311\\python.exe)`
          )
        );
      } else {
        reject(new Error(`Failed to spawn Python process: ${err.message}`));
      }
    });

    // Write payload as JSON to Python's stdin
    try {
      pythonProcess.stdin.write(JSON.stringify(payload));
      pythonProcess.stdin.end();
    } catch (writeError) {
      clearTimeout(timeout);
      reject(new Error(`Failed to write to Python stdin: ${writeError.message}`));
    }
  });
};

module.exports = { runPythonPredict };

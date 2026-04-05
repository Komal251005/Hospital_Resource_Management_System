const express = require('express');
const { getPrediction } = require('../controllers/predictionController');

const router = express.Router();

/**
 * @swagger
 * /api/predict:
 *   post:
 *     summary: Generate hospital resource predictions using ML prediction model
 *     tags: [Predictions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patients
 *             properties:
 *               patients:
 *                 type: integer
 *                 description: The current or expected number of patients
 *                 example: 150
 *     responses:
 *       200:
 *         description: Successful prediction
 *       400:
 *         description: Invalid input or ML model error
 *       401:
 *         description: Unauthorized
 */
router.post('/', getPrediction);

module.exports = router;

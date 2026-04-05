const express = require('express');
const router = express.Router();
const { predict, getDailyData, saveDailyData } = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { validatePredict } = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Predictive analytics and daily data
 */

/**
 * @swagger
 * /api/analytics/predict:
 *   post:
 *     summary: Predict resource needs for next 5 days using ML
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patients]
 *             properties:
 *               patients:
 *                 type: integer
 *                 example: 150
 *                 description: Expected patient count for next day
 *     responses:
 *       200:
 *         description: 5-day resource predictions
 *       400:
 *         description: Not enough historical data
 */
router.post('/predict', authenticate, validatePredict, predict);

/**
 * @swagger
 * /api/analytics/daily:
 *   get:
 *     summary: Get historical daily data for charts
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema: { type: integer, default: 30 }
 *         description: Number of days to fetch (max 365)
 *     responses:
 *       200:
 *         description: Historical daily records
 */
router.get('/daily', authenticate, getDailyData);

/**
 * @swagger
 * /api/analytics/daily:
 *   post:
 *     summary: Save or update daily data record (Admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Daily data saved
 */
router.post('/daily', authenticate, authorize('Admin'), saveDailyData);

module.exports = router;

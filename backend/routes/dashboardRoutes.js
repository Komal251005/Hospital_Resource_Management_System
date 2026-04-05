const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard summary statistics
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary (patients, resources, emergencies)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Aggregated dashboard statistics
 *       401:
 *         description: Unauthorized
 */
router.get('/summary', authenticate, getSummary);

module.exports = router;

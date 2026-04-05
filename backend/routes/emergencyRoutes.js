const express = require('express');
const router = express.Router();
const { getEmergencies, createEmergency, updateStatus } = require('../controllers/emergencyController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateEmergency } = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Emergency
 *   description: Emergency case management
 */

/**
 * @swagger
 * /api/emergency:
 *   get:
 *     summary: Get all emergency cases (with pagination & filters)
 *     tags: [Emergency]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *           enum: [Low, Medium, High, Critical]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Active, Resolved, Transferred]
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50 }
 *     responses:
 *       200:
 *         description: Paginated emergency cases
 */
router.get('/', authenticate, getEmergencies);

/**
 * @swagger
 * /api/emergency:
 *   post:
 *     summary: Create a new emergency case
 *     tags: [Emergency]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientName, severity]
 *             properties:
 *               patientName: { type: string, example: "Rahul Sharma" }
 *               age: { type: integer, example: 45 }
 *               severity: { type: string, enum: [Low, Medium, High, Critical] }
 *               requiredResources: { type: array, items: { type: string } }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Emergency case created
 */
router.post('/', authenticate, validateEmergency, createEmergency);

/**
 * @swagger
 * /api/emergency/{id}/status:
 *   put:
 *     summary: Update emergency case status
 *     tags: [Emergency]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [Pending, Active, Resolved, Transferred] }
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/:id/status', authenticate, updateStatus);

module.exports = router;

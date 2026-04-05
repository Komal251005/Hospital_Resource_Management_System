const express = require('express');
const router = express.Router();
const {
  getResources,
  createResource,
  updateResource,
  deleteResource,
} = require('../controllers/resourceController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { validateResource, validateResourceId } = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Resources
 *   description: Hospital resource management
 */

/**
 * @swagger
 * /api/resources:
 *   get:
 *     summary: Get all resources
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Bed, Equipment, Staff, Other]
 *     responses:
 *       200:
 *         description: List of resources
 */
router.get('/', authenticate, getResources);

/**
 * @swagger
 * /api/resources:
 *   post:
 *     summary: Create a new resource (Admin only)
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [resourceName, total, available]
 *             properties:
 *               resourceName: { type: string, example: "ICU Bed" }
 *               category: { type: string, enum: [Bed, Equipment, Staff, Other] }
 *               total: { type: integer, example: 50 }
 *               available: { type: integer, example: 20 }
 *     responses:
 *       201:
 *         description: Resource created
 *       403:
 *         description: Admin role required
 */
router.post('/', authenticate, authorize('Admin'), validateResource, createResource);

/**
 * @swagger
 * /api/resources/{id}:
 *   put:
 *     summary: Update a resource
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Resource updated
 *       404:
 *         description: Resource not found
 */
router.put('/:id', authenticate, validateResourceId, validateResource, updateResource);

/**
 * @swagger
 * /api/resources/{id}:
 *   delete:
 *     summary: Delete a resource (Admin only)
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Resource deleted
 *       404:
 *         description: Resource not found
 */
router.delete('/:id', authenticate, authorize('Admin'), validateResourceId, deleteResource);

module.exports = router;

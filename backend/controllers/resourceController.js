const Resource = require('../models/Resource');

/**
 * GET /api/resources
 * List all resources (with optional category filter)
 */
const getResources = async (req, res, next) => {
  try {
    const { category, sort = '-lastUpdated' } = req.query;
    const filter = category ? { category } : {};

    const resources = await Resource.find(filter)
      .sort(sort)
      .populate('updatedBy', 'name email');

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/resources
 * Create a new resource (Admin only)
 */
const createResource = async (req, res, next) => {
  try {
    const { resourceName, category, total, available } = req.body;

    const resource = await Resource.create({
      resourceName,
      category,
      total,
      available,
      updatedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/resources/:id
 * Update a resource
 */
const updateResource = async (req, res, next) => {
  try {
    const { resourceName, category, total, available } = req.body;

    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      {
        resourceName,
        category,
        total,
        available,
        lastUpdated: new Date(),
        updatedBy: req.user._id,
      },
      { new: true, runValidators: true }
    );

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/resources/:id
 * Delete a resource (Admin only)
 */
const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getResources, createResource, updateResource, deleteResource };

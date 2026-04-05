const EmergencyCase = require('../models/EmergencyCase');

/**
 * GET /api/emergency
 * List emergency cases (with optional severity/status filter)
 */
const getEmergencies = async (req, res, next) => {
  try {
    const { severity, status, limit = 50, page = 1 } = req.query;

    const filter = {};
    if (severity) filter.severity = severity;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [cases, total] = await Promise.all([
      EmergencyCase.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('handledBy', 'name role'),
      EmergencyCase.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: cases.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: cases,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/emergency
 * Create a new emergency case
 */
const createEmergency = async (req, res, next) => {
  try {
    const { patientName, age, severity, requiredResources, notes } = req.body;

    const emergencyCase = await EmergencyCase.create({
      patientName,
      age,
      severity,
      requiredResources: requiredResources || [],
      notes,
      handledBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Emergency case created successfully',
      data: emergencyCase,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/emergency/:id/status
 * Update emergency case status
 */
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Active', 'Resolved', 'Transferred'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const update = { status };
    if (status === 'Resolved') update.resolvedAt = new Date();

    const emergencyCase = await EmergencyCase.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );

    if (!emergencyCase) {
      return res.status(404).json({ success: false, message: 'Emergency case not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated',
      data: emergencyCase,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getEmergencies, createEmergency, updateStatus };

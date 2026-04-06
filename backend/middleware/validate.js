const { validationResult, body, param } = require('express-validator');

/**
 * Run validation and return 422 if errors found
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ── Auth Validators ──────────────────────────────────────────────
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Enter a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and a number'),
  body('role')
    .optional()
    .isIn(['Admin', 'Receptionist']).withMessage('Role must be Admin or Receptionist'),
  handleValidationErrors,
];

const validateLogin = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// ── Resource Validators ──────────────────────────────────────────
const validateResource = [
  body('resourceName').trim().notEmpty().withMessage('Resource name is required'),
  body('category')
    .optional()
    .isIn(['Bed', 'Equipment', 'Staff', 'Other']).withMessage('Invalid category'),
  body('total')
    .notEmpty().withMessage('Total is required')
    .isInt({ min: 0 }).withMessage('Total must be a non-negative integer'),
  body('available')
    .notEmpty().withMessage('Available is required')
    .isInt({ min: 0 }).withMessage('Available must be a non-negative integer')
    .custom((value, { req }) => {
      if (parseInt(value) > parseInt(req.body.total)) {
        throw new Error('Available cannot exceed total');
      }
      return true;
    }),
  handleValidationErrors,
];

const validateResourceId = [
  param('id').isMongoId().withMessage('Invalid resource ID'),
  handleValidationErrors,
];

// ── Emergency Validators ─────────────────────────────────────────
const validateEmergency = [
  body('patientName').trim().notEmpty().withMessage('Patient name is required'),
  body('severity')
    .notEmpty().withMessage('Severity is required')
    .isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid severity level'),
  body('age')
    .optional()
    .isInt({ min: 0, max: 150 }).withMessage('Age must be between 0 and 150'),
  body('requiredResources')
    .optional()
    .isArray().withMessage('Required resources must be an array'),
  handleValidationErrors,
];

// ── Analytics Validators ─────────────────────────────────────────
const validatePredict = [
  body('patients')
    .notEmpty().withMessage('Patient count is required')
    .isInt({ min: 1, max: 10000 }).withMessage('Patient count must be between 1 and 10,000'),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateResource,
  validateResourceId,
  validateEmergency,
  validatePredict,
};

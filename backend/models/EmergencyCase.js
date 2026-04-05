const mongoose = require('mongoose');

const EmergencyCaseSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    age: {
      type: Number,
      min: [0, 'Age cannot be negative'],
      max: [150, 'Age is not valid'],
    },
    severity: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High', 'Critical'],
        message: 'Severity must be Low, Medium, High, or Critical',
      },
      required: [true, 'Severity is required'],
    },
    requiredResources: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['Pending', 'Active', 'Resolved', 'Transferred'],
      default: 'Pending',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: {
      type: Date,
    },
    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for sorting by date and severity
EmergencyCaseSchema.index({ date: -1 });
EmergencyCaseSchema.index({ severity: 1, status: 1 });

module.exports = mongoose.model('EmergencyCase', EmergencyCaseSchema);

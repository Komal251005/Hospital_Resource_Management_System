const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema(
  {
    resourceName: {
      type: String,
      required: [true, 'Resource name is required'],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      enum: ['Bed', 'Equipment', 'Staff', 'Other'],
      default: 'Other',
    },
    total: {
      type: Number,
      required: [true, 'Total count is required'],
      min: [0, 'Total cannot be negative'],
    },
    available: {
      type: Number,
      required: [true, 'Available count is required'],
      min: [0, 'Available cannot be negative'],
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
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

// Virtual: utilization percentage
ResourceSchema.virtual('utilizationPercent').get(function () {
  if (this.total === 0) return 0;
  return Math.round(((this.total - this.available) / this.total) * 100);
});

// Pre-save: update lastUpdated
ResourceSchema.pre('save', function (next) {
  this.lastUpdated = new Date();
  next();
});

// Validate available <= total
ResourceSchema.pre('save', function (next) {
  if (this.available > this.total) {
    return next(new Error('Available count cannot exceed total count'));
  }
  next();
});

module.exports = mongoose.model('Resource', ResourceSchema);

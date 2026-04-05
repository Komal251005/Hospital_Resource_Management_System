const mongoose = require('mongoose');

const DailyDataSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
      unique: true,
    },
    patients: {
      type: Number,
      required: [true, 'Patient count is required'],
      min: [0, 'Cannot be negative'],
    },
    bedsUsed: {
      type: Number,
      required: [true, 'Beds used is required'],
      min: [0, 'Cannot be negative'],
    },
    icuUsed: {
      type: Number,
      required: [true, 'ICU used is required'],
      min: [0, 'Cannot be negative'],
    },
    ventilatorsUsed: {
      type: Number,
      required: [true, 'Ventilators used is required'],
      min: [0, 'Cannot be negative'],
    },
    emergencyCases: {
      type: Number,
      default: 0,
      min: [0, 'Cannot be negative'],
    },
    discharges: {
      type: Number,
      default: 0,
      min: [0, 'Cannot be negative'],
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index for time-series queries
DailyDataSchema.index({ date: -1 });

module.exports = mongoose.model('DailyData', DailyDataSchema);

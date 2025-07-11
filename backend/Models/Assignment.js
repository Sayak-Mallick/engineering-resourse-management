const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssignmentSchema = new Schema({
  engineerId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'projects',
    required: true
  },
  role: {
    type: String,
    enum: ['lead', 'developer', 'tester', 'analyst'],
    default: 'developer'
  },
  allocationPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'on-hold', 'cancelled'],
    default: 'active'
  },
  hoursAllocated: {
    type: Number,
    default: 0
  },
  hoursWorked: {
    type: Number,
    default: 0
  },
  hourlyRate: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  },
  assignedBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
AssignmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create compound index to prevent duplicate assignments
AssignmentSchema.index({ engineerId: 1, projectId: 1 }, { unique: true });

const AssignmentModel = mongoose.model("assignments", AssignmentSchema);
module.exports = AssignmentModel; 

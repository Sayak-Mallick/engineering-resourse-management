const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'on-hold', 'completed', 'cancelled'],
    default: 'planning'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  assignedEngineers: [{
    engineerId: {
      type: Schema.Types.ObjectId,
      ref: 'users'
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
    startDate: Date,
    endDate: Date
  }],
  projectManager: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  budget: {
    type: Number,
    default: 0
  },
  technologies: [{
    type: String
  }],
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
ProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ProjectModel = mongoose.model("projects", ProjectSchema);
module.exports = ProjectModel; 

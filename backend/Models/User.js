const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'project_manager', 'team_lead', 'engineer', 'user'],
    default: 'user'
  },
  skills: [{
    type: String
  }],
  experience: {
    type: Number,
    default: 0
  },
  hourlyRate: {
    type: Number,
    default: 0
  },
  availability: {
    type: String,
    enum: ['available', 'partially_available', 'unavailable'],
    default: 'available'
  },
  department: {
    type: String,
    default: 'Engineering'
  },
  phone: {
    type: String
  },
  location: {
    type: String
  },
  bio: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Update the updatedAt field before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;

const Joi = require('joi');

// Project validation
const projectValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    startDate: Joi.date().greater('now').required(),
    endDate: Joi.date().greater(Joi.ref('startDate')).required(),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium'),
    budget: Joi.number().min(0).default(0),
    technologies: Joi.array().items(Joi.string()),
    projectManager: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ message: "Bad Request", error: error.details[0].message });
  }
  
  next();
};

// Assignment validation
const assignmentValidation = (req, res, next) => {
  const schema = Joi.object({
    engineerId: Joi.string().required(),
    projectId: Joi.string().required(),
    role: Joi.string().valid('lead', 'developer', 'tester', 'analyst').default('developer'),
    allocationPercentage: Joi.number().min(0).max(100).default(100),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref('startDate')).required(),
    hoursAllocated: Joi.number().min(0).default(0),
    hourlyRate: Joi.number().min(0).default(0),
    notes: Joi.string().max(500)
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ message: "Bad Request", error: error.details[0].message });
  }
  
  next();
};

// User update validation
const userUpdateValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100),
    role: Joi.string().valid('admin', 'project_manager', 'team_lead', 'engineer', 'user'),
    skills: Joi.array().items(Joi.string()),
    experience: Joi.number().min(0),
    hourlyRate: Joi.number().min(0),
    availability: Joi.string().valid('available', 'partially_available', 'unavailable'),
    department: Joi.string(),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/),
    location: Joi.string(),
    bio: Joi.string().max(500)
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ message: "Bad Request", error: error.details[0].message });
  }
  
  next();
};

// Hours worked validation
const hoursWorkedValidation = (req, res, next) => {
  const schema = Joi.object({
    hoursWorked: Joi.number().min(0).required()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ message: "Bad Request", error: error.details[0].message });
  }
  
  next();
};

// Engineer assignment validation
const engineerAssignmentValidation = (req, res, next) => {
  const schema = Joi.object({
    engineerId: Joi.string().required(),
    role: Joi.string().valid('lead', 'developer', 'tester', 'analyst').default('developer'),
    allocationPercentage: Joi.number().min(0).max(100).default(100),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref('startDate')).required()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ message: "Bad Request", error: error.details[0].message });
  }
  
  next();
};

// Project update validation
const projectUpdateValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100),
    description: Joi.string().min(10).max(1000),
    status: Joi.string().valid('planning', 'active', 'on-hold', 'completed', 'cancelled'),
    startDate: Joi.date(),
    endDate: Joi.date(),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical'),
    budget: Joi.number().min(0),
    technologies: Joi.array().items(Joi.string()),
    projectManager: Joi.string()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ message: "Bad Request", error: error.details[0].message });
  }
  
  next();
};

module.exports = {
  projectValidation,
  assignmentValidation,
  userUpdateValidation,
  hoursWorkedValidation,
  engineerAssignmentValidation,
  projectUpdateValidation
}; 

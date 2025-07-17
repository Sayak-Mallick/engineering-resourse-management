const Joi = require('joi');

const signUpValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'project_manager', 'team_lead', 'engineer', 'user').default('user'),
    skills: Joi.string().default(""),
    experience: Joi.number().min(0).default(0),
    hourlyRate: Joi.number().min(0).default(0),
    availability: Joi.string().valid('available', 'partially_available', 'unavailable').default('available'),
    department: Joi.string().default('general'),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).default(''),
    location: Joi.string().default(''),
    address: Joi.string().default(''),
    bio: Joi.string().default(''),
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ message: "Bad Request", error});
  }
  
  next();
}

const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ message: "Bad Request", error });
  }
  
  next();
}

module.exports = { signUpValidation,loginValidation };

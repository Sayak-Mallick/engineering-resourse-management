const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User');

// Verify JWT token and attach user to request
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ message: "Access token required", success: false });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded._id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: "Invalid token", success: false });
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token", success: false });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired", success: false });
    }
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// Check if user has required role(s)
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required", success: false });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "You don't have permission to perform this action", 
        success: false 
      });
    }
    
    next();
  };
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  return authorizeRoles('admin')(req, res, next);
};

// Check if user is project manager or admin
const isProjectManager = (req, res, next) => {
  return authorizeRoles('admin', 'project_manager')(req, res, next);
};

// Check if user is team lead or higher
const isTeamLead = (req, res, next) => {
  return authorizeRoles('admin', 'project_manager', 'team_lead')(req, res, next);
};

// Check if user can manage their own data or is admin
const canManageUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required", success: false });
  }
  
  const targetUserId = req.params.id || req.params.userId;
  
  if (req.user.role === 'admin' || req.user._id.toString() === targetUserId) {
    return next();
  }
  
  return res.status(403).json({ 
    message: "You don't have permission to manage this user", 
    success: false 
  });
};

// Check if user can manage project (project manager or admin)
const canManageProject = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required", success: false });
    }
    
    if (req.user.role === 'admin') {
      return next();
    }
    
    const projectId = req.params.id || req.params.projectId;
    const ProjectModel = require('../Models/Project');
    const project = await ProjectModel.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found", success: false });
    }
    
    if (project.projectManager.toString() === req.user._id.toString()) {
      return next();
    }
    
    return res.status(403).json({ 
      message: "You don't have permission to manage this project", 
      success: false 
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  isAdmin,
  isProjectManager,
  isTeamLead,
  canManageUser,
  canManageProject
}; 

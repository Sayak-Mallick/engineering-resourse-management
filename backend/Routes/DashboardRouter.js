const { 
  getDashboardStats, 
  getProjectAnalytics, 
  getEngineerAnalytics, 
  getResourceCapacity 
} = require('../Controllers/DashboardController');

const { 
  authenticateToken, 
  isProjectManager 
} = require('../Middlewares/AuthMiddleware');

const router = require('express').Router();

// All dashboard routes require authentication and project manager role or higher
router.get('/stats', authenticateToken, isProjectManager, getDashboardStats);
router.get('/project/:projectId/analytics', authenticateToken, isProjectManager, getProjectAnalytics);
router.get('/engineer/:engineerId/analytics', authenticateToken, isProjectManager, getEngineerAnalytics);
router.get('/resource-capacity', authenticateToken, isProjectManager, getResourceCapacity);

module.exports = router; 

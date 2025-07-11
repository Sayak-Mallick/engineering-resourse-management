const { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  getEngineers, 
  getProjectManagers, 
  getUserDashboard, 
  getAvailableEngineers 
} = require('../Controllers/UserController');

const { 
  authenticateToken, 
  isAdmin, 
  isProjectManager, 
  canManageUser 
} = require('../Middlewares/AuthMiddleware');

const { 
  userUpdateValidation 
} = require('../Middlewares/ValidationMiddleware');

const router = require('express').Router();

// Public routes (with authentication)
router.get('/dashboard/:id', authenticateToken, getUserDashboard);
router.get('/engineers', authenticateToken, getEngineers);
router.get('/project-managers', authenticateToken, getProjectManagers);
router.get('/available-engineers', authenticateToken, getAvailableEngineers);

// Protected routes (admins and project managers)
router.get('/', authenticateToken, isProjectManager, getAllUsers);
router.get('/:id', authenticateToken, isProjectManager, getUserById);

// User management (admins only, or users managing their own profile)
router.put('/:id', authenticateToken, canManageUser, userUpdateValidation, updateUser);
router.delete('/:id', authenticateToken, isAdmin, deleteUser);

module.exports = router; 

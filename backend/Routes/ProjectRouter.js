const { 
  createProject, 
  getAllProjects, 
  getProjectById, 
  updateProject, 
  deleteProject, 
  assignEngineer, 
  removeEngineer, 
  getProjectsByStatus 
} = require('../Controllers/ProjectController');

const { 
  authenticateToken, 
  isProjectManager, 
  canManageProject 
} = require('../Middlewares/AuthMiddleware');

const { 
  projectValidation, 
  projectUpdateValidation, 
  engineerAssignmentValidation 
} = require('../Middlewares/ValidationMiddleware');

const router = require('express').Router();

// Public routes (with authentication)
router.get('/', authenticateToken, getAllProjects);
router.get('/status/:status', authenticateToken, getProjectsByStatus);
router.get('/:id', authenticateToken, getProjectById);

// Protected routes (project managers and admins only)
router.post('/', authenticateToken, isProjectManager, projectValidation, createProject);
router.put('/:id', authenticateToken, canManageProject, projectUpdateValidation, updateProject);
router.delete('/:id', authenticateToken, canManageProject, deleteProject);

// Engineer assignment routes
router.post('/:projectId/assign-engineer', authenticateToken, canManageProject, engineerAssignmentValidation, assignEngineer);
router.delete('/:projectId/remove-engineer/:engineerId', authenticateToken, canManageProject, removeEngineer);

module.exports = router; 

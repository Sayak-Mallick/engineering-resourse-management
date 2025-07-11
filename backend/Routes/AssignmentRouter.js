const { 
  createAssignment, 
  getAllAssignments, 
  getAssignmentsByEngineer, 
  getAssignmentsByProject, 
  updateAssignment, 
  deleteAssignment, 
  updateHoursWorked, 
  getEngineerCapacity, 
  getProjectResourceAllocation 
} = require('../Controllers/AssignmentController');

const { 
  authenticateToken, 
  isTeamLead, 
  canManageUser 
} = require('../Middlewares/AuthMiddleware');

const { 
  assignmentValidation, 
  hoursWorkedValidation 
} = require('../Middlewares/ValidationMiddleware');

const router = require('express').Router();

// Public routes (with authentication)
router.get('/', authenticateToken, getAllAssignments);
router.get('/engineer/:engineerId', authenticateToken, getAssignmentsByEngineer);
router.get('/project/:projectId', authenticateToken, getAssignmentsByProject);
router.get('/capacity/:engineerId', authenticateToken, getEngineerCapacity);
router.get('/project/:projectId/resource-allocation', authenticateToken, getProjectResourceAllocation);

// Protected routes (team leads and higher)
router.post('/', authenticateToken, isTeamLead, assignmentValidation, createAssignment);
router.put('/:id', authenticateToken, isTeamLead, assignmentValidation, updateAssignment);
router.delete('/:id', authenticateToken, isTeamLead, deleteAssignment);

// Hours tracking (engineers can update their own hours)
router.put('/:id/hours', authenticateToken, hoursWorkedValidation, updateHoursWorked);

module.exports = router; 

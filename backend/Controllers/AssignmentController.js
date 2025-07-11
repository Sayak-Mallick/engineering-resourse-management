const AssignmentModel = require('../Models/Assignment');
const ProjectModel = require('../Models/Project');
const UserModel = require('../Models/User');

// Create a new assignment
const createAssignment = async (req, res) => {
  try {
    const { engineerId, projectId, role, allocationPercentage, startDate, endDate, hoursAllocated, hourlyRate, notes } = req.body;
    const assignedBy = req.user._id; // From auth middleware
    
    // Check if engineer exists
    const engineer = await UserModel.findById(engineerId);
    if (!engineer) {
      return res.status(404).json({ message: "Engineer not found", success: false });
    }
    
    // Check if project exists
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found", success: false });
    }
    
    // Check if assignment already exists
    const existingAssignment = await AssignmentModel.findOne({ engineerId, projectId });
    if (existingAssignment) {
      return res.status(400).json({ message: "Assignment already exists", success: false });
    }
    
    const assignment = new AssignmentModel({
      engineerId,
      projectId,
      role,
      allocationPercentage,
      startDate,
      endDate,
      hoursAllocated,
      hourlyRate,
      notes,
      assignedBy
    });
    
    await assignment.save();
    
    const populatedAssignment = await AssignmentModel.findById(assignment._id)
      .populate('engineerId', 'name email role skills')
      .populate('projectId', 'name description status')
      .populate('assignedBy', 'name email');
    
    res.status(201).json({ message: "Assignment created successfully", success: true, assignment: populatedAssignment });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Get all assignments
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await AssignmentModel.find()
      .populate('engineerId', 'name email role skills')
      .populate('projectId', 'name description status')
      .populate('assignedBy', 'name email');
    
    res.status(200).json({ assignments, success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Get assignments by engineer
const getAssignmentsByEngineer = async (req, res) => {
  try {
    const { engineerId } = req.params;
    const assignments = await AssignmentModel.find({ engineerId })
      .populate('projectId', 'name description status startDate endDate')
      .populate('assignedBy', 'name email');
    
    res.status(200).json({ assignments, success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Get assignments by project
const getAssignmentsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const assignments = await AssignmentModel.find({ projectId })
      .populate('engineerId', 'name email role skills')
      .populate('assignedBy', 'name email');
    
    res.status(200).json({ assignments, success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Update assignment
const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const assignment = await AssignmentModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('engineerId', 'name email role skills')
     .populate('projectId', 'name description status')
     .populate('assignedBy', 'name email');
    
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found", success: false });
    }
    
    res.status(200).json({ message: "Assignment updated successfully", success: true, assignment });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Delete assignment
const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await AssignmentModel.findByIdAndDelete(id);
    
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found", success: false });
    }
    
    res.status(200).json({ message: "Assignment deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Update hours worked
const updateHoursWorked = async (req, res) => {
  try {
    const { id } = req.params;
    const { hoursWorked } = req.body;
    
    const assignment = await AssignmentModel.findByIdAndUpdate(
      id,
      { hoursWorked },
      { new: true, runValidators: true }
    ).populate('engineerId', 'name email role skills')
     .populate('projectId', 'name description status');
    
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found", success: false });
    }
    
    res.status(200).json({ message: "Hours updated successfully", success: true, assignment });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Get engineer capacity
const getEngineerCapacity = async (req, res) => {
  try {
    const { engineerId } = req.params;
    const { startDate, endDate } = req.query;
    
    let query = { engineerId, status: 'active' };
    if (startDate && endDate) {
      query.startDate = { $lte: new Date(endDate) };
      query.endDate = { $gte: new Date(startDate) };
    }
    
    const assignments = await AssignmentModel.find(query)
      .populate('projectId', 'name description status');
    
    const totalAllocation = assignments.reduce((sum, assignment) => sum + assignment.allocationPercentage, 0);
    const availableCapacity = 100 - totalAllocation;
    
    res.status(200).json({ 
      assignments, 
      totalAllocation, 
      availableCapacity, 
      success: true 
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Get project resource allocation
const getProjectResourceAllocation = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const assignments = await AssignmentModel.find({ projectId })
      .populate('engineerId', 'name email role skills');
    
    const totalEngineers = assignments.length;
    const totalAllocation = assignments.reduce((sum, assignment) => sum + assignment.allocationPercentage, 0);
    const totalHoursAllocated = assignments.reduce((sum, assignment) => sum + assignment.hoursAllocated, 0);
    const totalHoursWorked = assignments.reduce((sum, assignment) => sum + assignment.hoursWorked, 0);
    
    res.status(200).json({ 
      assignments, 
      totalEngineers, 
      totalAllocation, 
      totalHoursAllocated, 
      totalHoursWorked, 
      success: true 
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentsByEngineer,
  getAssignmentsByProject,
  updateAssignment,
  deleteAssignment,
  updateHoursWorked,
  getEngineerCapacity,
  getProjectResourceAllocation
}; 

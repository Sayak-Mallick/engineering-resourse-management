const ProjectModel = require('../Models/Project');
const UserModel = require('../Models/User');

// Create a new project
const createProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate, priority, budget, technologies, projectManager } = req.body;
    
    // Check if project manager exists and has appropriate role
    const manager = await UserModel.findById(projectManager);
    if (!manager) {
      return res.status(404).json({ message: "Project manager not found", success: false });
    }
    
    if (!['admin', 'project_manager'].includes(manager.role)) {
      return res.status(403).json({ message: "User is not authorized to be a project manager", success: false });
    }

    const project = new ProjectModel({
      name,
      description,
      startDate,
      endDate,
      priority,
      budget,
      technologies,
      projectManager
    });

    await project.save();
    res.status(201).json({ message: "Project created successfully", success: true, project });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.find()
      .populate('projectManager', 'name email role')
      .populate('assignedEngineers.engineerId', 'name email role skills');
    
    res.status(200).json({ projects, success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Get project by ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await ProjectModel.findById(id)
      .populate('projectManager', 'name email role')
      .populate('assignedEngineers.engineerId', 'name email role skills');
    
    if (!project) {
      return res.status(404).json({ message: "Project not found", success: false });
    }
    
    res.status(200).json({ project, success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const project = await ProjectModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('projectManager', 'name email role')
     .populate('assignedEngineers.engineerId', 'name email role skills');
    
    if (!project) {
      return res.status(404).json({ message: "Project not found", success: false });
    }
    
    res.status(200).json({ message: "Project updated successfully", success: true, project });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await ProjectModel.findByIdAndDelete(id);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found", success: false });
    }
    
    res.status(200).json({ message: "Project deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Assign engineer to project
const assignEngineer = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { engineerId, role, allocationPercentage, startDate, endDate } = req.body;
    
    // Check if project exists
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found", success: false });
    }
    
    // Check if engineer exists and has appropriate role
    const engineer = await UserModel.findById(engineerId);
    if (!engineer) {
      return res.status(404).json({ message: "Engineer not found", success: false });
    }
    
    if (!['engineer', 'team_lead'].includes(engineer.role)) {
      return res.status(403).json({ message: "User is not authorized to be assigned as engineer", success: false });
    }
    
    // Check if engineer is already assigned to this project
    const existingAssignment = project.assignedEngineers.find(
      assignment => assignment.engineerId.toString() === engineerId
    );
    
    if (existingAssignment) {
      return res.status(400).json({ message: "Engineer is already assigned to this project", success: false });
    }
    
    // Add engineer to project
    project.assignedEngineers.push({
      engineerId,
      role,
      allocationPercentage,
      startDate,
      endDate
    });
    
    await project.save();
    
    const updatedProject = await ProjectModel.findById(projectId)
      .populate('projectManager', 'name email role')
      .populate('assignedEngineers.engineerId', 'name email role skills');
    
    res.status(200).json({ message: "Engineer assigned successfully", success: true, project: updatedProject });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Remove engineer from project
const removeEngineer = async (req, res) => {
  try {
    const { projectId, engineerId } = req.params;
    
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found", success: false });
    }
    
    project.assignedEngineers = project.assignedEngineers.filter(
      assignment => assignment.engineerId.toString() !== engineerId
    );
    
    await project.save();
    
    const updatedProject = await ProjectModel.findById(projectId)
      .populate('projectManager', 'name email role')
      .populate('assignedEngineers.engineerId', 'name email role skills');
    
    res.status(200).json({ message: "Engineer removed successfully", success: true, project: updatedProject });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Get projects by status
const getProjectsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const projects = await ProjectModel.find({ status })
      .populate('projectManager', 'name email role')
      .populate('assignedEngineers.engineerId', 'name email role skills');
    
    res.status(200).json({ projects, success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  assignEngineer,
  removeEngineer,
  getProjectsByStatus
}; 

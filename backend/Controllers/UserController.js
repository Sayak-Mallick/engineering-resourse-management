const UserModel = require('../Models/User');
const AssignmentModel = require('../Models/Assignment');

// Get all users (with role-based filtering)
const getAllUsers = async (req, res) => {
  try {
    const { role, department } = req.query;
    let query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (department) {
      query.department = department;
    }
    
    const users = await UserModel.find(query).select('-password');
    res.status(200).json({ users, success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    
    res.status(200).json({ user, success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Update user profile
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Don't allow password update through this endpoint
    delete updateData.password;
    
    const user = await UserModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    
    res.status(200).json({ message: "User updated successfully", success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user has active assignments
    const activeAssignments = await AssignmentModel.find({ 
      engineerId: id, 
      status: 'active' 
    });
    
    if (activeAssignments.length > 0) {
      return res.status(400).json({ 
        message: "Cannot delete user with active assignments", 
        success: false 
      });
    }
    
    const user = await UserModel.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    
    res.status(200).json({ message: "User deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Get engineers (users with engineer role)
const getEngineers = async (req, res) => {
  try {
    const { availability, skills } = req.query;
    let query = { role: { $in: ['engineer', 'team_lead'] } };
    
    if (availability) {
      query.availability = availability;
    }
    
    if (skills) {
      query.skills = { $in: skills.split(',') };
    }
    
    const engineers = await UserModel.find(query).select('-password');
    res.status(200).json({ engineers, success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Get project managers
const getProjectManagers = async (req, res) => {
  try {
    const projectManagers = await UserModel.find({ 
      role: { $in: ['admin', 'project_manager'] } 
    }).select('-password');
    
    res.status(200).json({ projectManagers, success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Get user dashboard data
const getUserDashboard = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    
    let dashboardData = {
      user,
      assignments: [],
      totalProjects: 0,
      totalHours: 0,
      currentAllocation: 0
    };
    
    // Get assignments for engineers
    if (['engineer', 'team_lead'].includes(user.role)) {
      const assignments = await AssignmentModel.find({ engineerId: id })
        .populate('projectId', 'name description status startDate endDate');
      
      dashboardData.assignments = assignments;
      dashboardData.totalProjects = assignments.length;
      dashboardData.totalHours = assignments.reduce((sum, assignment) => sum + assignment.hoursWorked, 0);
      dashboardData.currentAllocation = assignments
        .filter(assignment => assignment.status === 'active')
        .reduce((sum, assignment) => sum + assignment.allocationPercentage, 0);
    }
    
    // Get managed projects for project managers
    if (['admin', 'project_manager'].includes(user.role)) {
      const ProjectModel = require('../Models/Project');
      const managedProjects = await ProjectModel.find({ projectManager: id })
        .populate('assignedEngineers.engineerId', 'name email role');
      
      dashboardData.managedProjects = managedProjects;
      dashboardData.totalProjects = managedProjects.length;
    }
    
    res.status(200).json({ dashboardData, success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Get available engineers for assignment
const getAvailableEngineers = async (req, res) => {
  try {
    const { startDate, endDate, skills, minCapacity } = req.query;
    
    let query = { 
      role: { $in: ['engineer', 'team_lead'] },
      availability: { $ne: 'unavailable' }
    };
    
    if (skills) {
      query.skills = { $in: skills.split(',') };
    }
    
    const engineers = await UserModel.find(query).select('-password');
    
    // Filter by capacity if date range is provided
    let availableEngineers = engineers;
    if (startDate && endDate) {
      const capacityPromises = engineers.map(async (engineer) => {
        const capacityQuery = {
          engineerId: engineer._id,
          status: 'active',
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        };
        
        const assignments = await AssignmentModel.find(capacityQuery);
        const totalAllocation = assignments.reduce((sum, assignment) => sum + assignment.allocationPercentage, 0);
        const availableCapacity = 100 - totalAllocation;
        
        return {
          ...engineer.toObject(),
          availableCapacity,
          currentAllocation: totalAllocation
        };
      });
      
      availableEngineers = await Promise.all(capacityPromises);
      
      // Filter by minimum capacity if specified
      if (minCapacity) {
        availableEngineers = availableEngineers.filter(engineer => engineer.availableCapacity >= parseInt(minCapacity));
      }
    }
    
    res.status(200).json({ engineers: availableEngineers, success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getEngineers,
  getProjectManagers,
  getUserDashboard,
  getAvailableEngineers
}; 

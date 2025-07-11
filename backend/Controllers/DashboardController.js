const ProjectModel = require('../Models/Project');
const AssignmentModel = require('../Models/Assignment');
const UserModel = require('../Models/User');

// Get overall dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalProjects = await ProjectModel.countDocuments();
    const totalEngineers = await UserModel.countDocuments({ role: { $in: ['engineer', 'team_lead'] } });
    const totalAssignments = await AssignmentModel.countDocuments();
    const activeProjects = await ProjectModel.countDocuments({ status: 'active' });
    
    // Get project status distribution
    const projectStatusStats = await ProjectModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get engineer availability stats
    const engineerAvailabilityStats = await UserModel.aggregate([
      {
        $match: { role: { $in: ['engineer', 'team_lead'] } }
      },
      {
        $group: {
          _id: '$availability',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get recent projects
    const recentProjects = await ProjectModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('projectManager', 'name email');
    
    // Get projects ending soon (within 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const projectsEndingSoon = await ProjectModel.find({
      endDate: { $lte: thirtyDaysFromNow, $gte: new Date() },
      status: { $in: ['active', 'planning'] }
    }).populate('projectManager', 'name email');
    
    // Get resource utilization
    const activeAssignments = await AssignmentModel.find({ status: 'active' });
    const totalAllocation = activeAssignments.reduce((sum, assignment) => sum + assignment.allocationPercentage, 0);
    const averageUtilization = totalAllocation / Math.max(totalEngineers, 1);
    
    res.status(200).json({
      stats: {
        totalProjects,
        totalEngineers,
        totalAssignments,
        activeProjects,
        averageUtilization: Math.round(averageUtilization * 100) / 100
      },
      projectStatusStats,
      engineerAvailabilityStats,
      recentProjects,
      projectsEndingSoon,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Get project analytics
const getProjectAnalytics = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await ProjectModel.findById(projectId)
      .populate('projectManager', 'name email')
      .populate('assignedEngineers.engineerId', 'name email role skills');
    
    if (!project) {
      return res.status(404).json({ message: "Project not found", success: false });
    }
    
    // Get assignment details
    const assignments = await AssignmentModel.find({ projectId })
      .populate('engineerId', 'name email role skills');
    
    // Calculate project metrics
    const totalEngineers = assignments.length;
    const totalAllocation = assignments.reduce((sum, assignment) => sum + assignment.allocationPercentage, 0);
    const totalHoursAllocated = assignments.reduce((sum, assignment) => sum + assignment.hoursAllocated, 0);
    const totalHoursWorked = assignments.reduce((sum, assignment) => sum + assignment.hoursWorked, 0);
    const progressPercentage = totalHoursAllocated > 0 ? (totalHoursWorked / totalHoursAllocated) * 100 : 0;
    
    // Calculate timeline progress
    const now = new Date();
    const totalDuration = new Date(project.endDate) - new Date(project.startDate);
    const elapsedDuration = now - new Date(project.startDate);
    const timelineProgress = Math.min(Math.max((elapsedDuration / totalDuration) * 100, 0), 100);
    
    // Get role distribution
    const roleDistribution = assignments.reduce((acc, assignment) => {
      const role = assignment.role;
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});
    
    res.status(200).json({
      project,
      analytics: {
        totalEngineers,
        totalAllocation,
        totalHoursAllocated,
        totalHoursWorked,
        progressPercentage: Math.round(progressPercentage * 100) / 100,
        timelineProgress: Math.round(timelineProgress * 100) / 100,
        roleDistribution
      },
      assignments,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Get engineer analytics
const getEngineerAnalytics = async (req, res) => {
  try {
    const { engineerId } = req.params;
    
    const engineer = await UserModel.findById(engineerId).select('-password');
    if (!engineer) {
      return res.status(404).json({ message: "Engineer not found", success: false });
    }
    
    // Get all assignments
    const assignments = await AssignmentModel.find({ engineerId })
      .populate('projectId', 'name description status startDate endDate');
    
    // Calculate metrics
    const totalProjects = assignments.length;
    const activeAssignments = assignments.filter(assignment => assignment.status === 'active');
    const totalHoursWorked = assignments.reduce((sum, assignment) => sum + assignment.hoursWorked, 0);
    const currentAllocation = activeAssignments.reduce((sum, assignment) => sum + assignment.allocationPercentage, 0);
    
    // Get project distribution by status
    const projectStatusDistribution = assignments.reduce((acc, assignment) => {
      const status = assignment.projectId.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    // Get role distribution
    const roleDistribution = assignments.reduce((acc, assignment) => {
      const role = assignment.role;
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});
    
    // Get monthly hours worked (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const recentAssignments = assignments.filter(assignment => 
      new Date(assignment.startDate) >= sixMonthsAgo
    );
    
    res.status(200).json({
      engineer,
      analytics: {
        totalProjects,
        activeProjects: activeAssignments.length,
        totalHoursWorked,
        currentAllocation,
        projectStatusDistribution,
        roleDistribution
      },
      assignments: recentAssignments,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

// Get resource capacity overview
const getResourceCapacity = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        startDate: { $lte: new Date(endDate) },
        endDate: { $gte: new Date(startDate) }
      };
    }
    
    // Get all engineers
    const engineers = await UserModel.find({ 
      role: { $in: ['engineer', 'team_lead'] } 
    }).select('-password');
    
    // Get their assignments
    const capacityData = await Promise.all(engineers.map(async (engineer) => {
      const assignments = await AssignmentModel.find({
        engineerId: engineer._id,
        status: 'active',
        ...dateFilter
      }).populate('projectId', 'name status');
      
      const totalAllocation = assignments.reduce((sum, assignment) => sum + assignment.allocationPercentage, 0);
      const availableCapacity = Math.max(100 - totalAllocation, 0);
      
      return {
        engineer: {
          _id: engineer._id,
          name: engineer.name,
          email: engineer.email,
          role: engineer.role,
          skills: engineer.skills,
          availability: engineer.availability
        },
        totalAllocation,
        availableCapacity,
        assignments: assignments.map(assignment => ({
          projectName: assignment.projectId.name,
          projectStatus: assignment.projectId.status,
          allocation: assignment.allocationPercentage,
          role: assignment.role
        }))
      };
    }));
    
    // Calculate overall capacity metrics
    const totalEngineers = capacityData.length;
    const totalAllocation = capacityData.reduce((sum, data) => sum + data.totalAllocation, 0);
    const averageUtilization = totalEngineers > 0 ? totalAllocation / totalEngineers : 0;
    const underutilizedEngineers = capacityData.filter(data => data.availableCapacity > 50).length;
    const overutilizedEngineers = capacityData.filter(data => data.totalAllocation > 100).length;
    
    res.status(200).json({
      capacityData,
      summary: {
        totalEngineers,
        averageUtilization: Math.round(averageUtilization * 100) / 100,
        underutilizedEngineers,
        overutilizedEngineers
      },
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

module.exports = {
  getDashboardStats,
  getProjectAnalytics,
  getEngineerAnalytics,
  getResourceCapacity
}; 

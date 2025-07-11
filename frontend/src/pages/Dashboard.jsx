import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { notifyError } from '../utils';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('loggenInUser');
    
    if (!token) {
      navigate('/login');
      return;
    }

    setUser(userData);
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        notifyError('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      notifyError('Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggenInUser');
    navigate('/login');
  };

  const getRoleBasedContent = () => {
    if (!user) return null;

    const userRole = localStorage.getItem('userRole') || 'user';

    switch (userRole) {
      case 'admin':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Projects</h3>
              <p className="text-3xl font-bold text-blue-600">{dashboardData?.stats?.totalProjects || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Engineers</h3>
              <p className="text-3xl font-bold text-green-600">{dashboardData?.stats?.totalEngineers || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Projects</h3>
              <p className="text-3xl font-bold text-purple-600">{dashboardData?.stats?.activeProjects || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Avg Utilization</h3>
              <p className="text-3xl font-bold text-orange-600">{dashboardData?.stats?.averageUtilization || 0}%</p>
            </div>
          </div>
        );

      case 'project_manager':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">My Projects</h3>
              <p className="text-3xl font-bold text-blue-600">{dashboardData?.stats?.totalProjects || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Team Members</h3>
              <p className="text-3xl font-bold text-green-600">{dashboardData?.stats?.totalEngineers || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Projects</h3>
              <p className="text-3xl font-bold text-purple-600">{dashboardData?.stats?.activeProjects || 0}</p>
            </div>
          </div>
        );

      case 'engineer':
      case 'team_lead':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">My Assignments</h3>
              <p className="text-3xl font-bold text-blue-600">{dashboardData?.stats?.totalAssignments || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Hours Worked</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Welcome!</h3>
            <p className="text-gray-600">You have basic access to the system.</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Engineering Resource Management</h1>
              <p className="text-gray-600">Welcome back, {user}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/projects')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Projects
              </button>
              <button
                onClick={() => navigate('/engineers')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Engineers
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {getRoleBasedContent()}

        {/* Recent Projects */}
        {dashboardData?.recentProjects && dashboardData.recentProjects.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Projects</h2>
            <div className="space-y-4">
              {dashboardData.recentProjects.map((project, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-800">{project.name}</h3>
                    <p className="text-sm text-gray-600">{project.projectManager?.name}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/projects/new')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create New Project
              </button>
              <button
                onClick={() => navigate('/assignments/new')}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Assign Engineer
              </button>
              <button
                onClick={() => navigate('/engineers/new')}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Engineer
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Database</span>
                <span className="text-green-600 font-medium">Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">API</span>
                <span className="text-green-600 font-medium">Healthy</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Sync</span>
                <span className="text-gray-800 font-medium">Just now</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                <p>• Project "E-commerce Platform" updated</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
              <div className="text-sm text-gray-600">
                <p>• Engineer assigned to "Mobile App"</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
              <div className="text-sm text-gray-600">
                <p>• New project "AI Integration" created</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Dashboard; 

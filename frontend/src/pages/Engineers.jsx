import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { notifyError, notifySuccess } from '../utils';

const Engineers = () => {
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEngineers();
  }, []);

  const fetchEngineers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/users/engineers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEngineers(data.engineers || []);
      } else {
        notifyError('Failed to fetch engineers');
      }
    } catch (error) {
      console.error('Engineers error:', error);
      notifyError('Error loading engineers');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEngineer = async (engineerId) => {
    if (!window.confirm('Are you sure you want to delete this engineer?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/users/${engineerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        notifySuccess('Engineer deleted successfully');
        fetchEngineers();
      } else {
        notifyError('Failed to delete engineer');
      }
    } catch (error) {
      console.error('Delete error:', error);
      notifyError('Error deleting engineer');
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'partially_available':
        return 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'team_lead':
        return 'bg-purple-100 text-purple-800';
      case 'engineer':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEngineers = engineers.filter(engineer => {
    const matchesFilter = filter === 'all' || engineer.availability === filter;
    const matchesSearch = engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         engineer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (engineer.skills && engineer.skills.some(skill => 
                           skill.toLowerCase().includes(searchTerm.toLowerCase())
                         ));
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading engineers...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Engineers</h1>
              <p className="text-gray-600">Manage your engineering team</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/engineers/new')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Engineer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search engineers by name, email, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Availability</option>
                <option value="available">Available</option>
                <option value="partially_available">Partially Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Engineers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEngineers.map((engineer) => (
            <div key={engineer._id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{engineer.name}</h3>
                    <p className="text-sm text-gray-600">{engineer.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(engineer.availability)}`}>
                      {engineer.availability?.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(engineer.role)}`}>
                      {engineer.role?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Experience:</span>
                    <span className="text-gray-800">{engineer.experience || 0} years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Hourly Rate:</span>
                    <span className="text-gray-800">${engineer.hourlyRate || 0}/hr</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Department:</span>
                    <span className="text-gray-800">{engineer.department || 'Engineering'}</span>
                  </div>
                  {engineer.location && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Location:</span>
                      <span className="text-gray-800">{engineer.location}</span>
                    </div>
                  )}
                </div>

                {engineer.skills && engineer.skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {engineer.skills.slice(0, 4).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                      {engineer.skills.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{engineer.skills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {engineer.bio && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{engineer.bio}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/engineers/${engineer._id}`)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => navigate(`/engineers/${engineer._id}/edit`)}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEngineer(engineer._id)}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEngineers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👨‍💻</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No engineers found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
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

export default Engineers; 

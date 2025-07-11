const API_BASE_URL = 'https://engineering-resourse-management.vercel.app/';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  signup: (userData) => apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData)
  })
};

// Projects API calls
export const projectsAPI = {
  getAll: () => apiCall('/projects'),
  
  getById: (id) => apiCall(`/projects/${id}`),
  
  create: (projectData) => apiCall('/projects', {
    method: 'POST',
    body: JSON.stringify(projectData)
  }),
  
  update: (id, projectData) => apiCall(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(projectData)
  }),
  
  delete: (id) => apiCall(`/projects/${id}`, {
    method: 'DELETE'
  }),
  
  getByStatus: (status) => apiCall(`/projects/status/${status}`),
  
  assignEngineer: (projectId, assignmentData) => apiCall(`/projects/${projectId}/assign-engineer`, {
    method: 'POST',
    body: JSON.stringify(assignmentData)
  }),
  
  removeEngineer: (projectId, engineerId) => apiCall(`/projects/${projectId}/remove-engineer/${engineerId}`, {
    method: 'DELETE'
  })
};

// Assignments API calls
export const assignmentsAPI = {
  getAll: () => apiCall('/assignments'),
  
  getByEngineer: (engineerId) => apiCall(`/assignments/engineer/${engineerId}`),
  
  getByProject: (projectId) => apiCall(`/assignments/project/${projectId}`),
  
  create: (assignmentData) => apiCall('/assignments', {
    method: 'POST',
    body: JSON.stringify(assignmentData)
  }),
  
  update: (id, assignmentData) => apiCall(`/assignments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(assignmentData)
  }),
  
  delete: (id) => apiCall(`/assignments/${id}`, {
    method: 'DELETE'
  }),
  
  updateHours: (id, hoursWorked) => apiCall(`/assignments/${id}/hours`, {
    method: 'PUT',
    body: JSON.stringify({ hoursWorked })
  }),
  
  getEngineerCapacity: (engineerId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/assignments/capacity/${engineerId}?${queryString}`);
  },
  
  getProjectResourceAllocation: (projectId) => apiCall(`/assignments/project/${projectId}/resource-allocation`)
};

// Users API calls
export const usersAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/users?${queryString}`);
  },
  
  getById: (id) => apiCall(`/users/${id}`),
  
  update: (id, userData) => apiCall(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  }),
  
  delete: (id) => apiCall(`/users/${id}`, {
    method: 'DELETE'
  }),
  
  getEngineers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/users/engineers?${queryString}`);
  },
  
  getProjectManagers: () => apiCall('/users/project-managers'),
  
  getUserDashboard: (id) => apiCall(`/users/dashboard/${id}`),
  
  getAvailableEngineers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/users/available-engineers?${queryString}`);
  }
};

// Dashboard API calls
export const dashboardAPI = {
  getStats: () => apiCall('/dashboard/stats'),
  
  getProjectAnalytics: (projectId) => apiCall(`/dashboard/project/${projectId}/analytics`),
  
  getEngineerAnalytics: (engineerId) => apiCall(`/dashboard/engineer/${engineerId}/analytics`),
  
  getResourceCapacity: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/dashboard/resource-capacity?${queryString}`);
  }
};

export default {
  auth: authAPI,
  projects: projectsAPI,
  assignments: assignmentsAPI,
  users: usersAPI,
  dashboard: dashboardAPI
}; 

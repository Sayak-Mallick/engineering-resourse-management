import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { notifyError } from '../utils';

const ProjectView = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://erm-api.onrender.com/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
      } else {
        notifyError('Failed to fetch project');
      }
    } catch (error) {
      notifyError('Error loading project',error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!project) return <div className="p-8 text-center">Project not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <p className="mb-2 text-gray-700">{project.description}</p>
      <div className="mb-2">Status: <span className="font-semibold">{project.status}</span></div>
      <div className="mb-2">Priority: <span className="font-semibold">{project.priority}</span></div>
      <div className="mb-2">Start: {new Date(project.startDate).toLocaleDateString()} | End: {new Date(project.endDate).toLocaleDateString()}</div>
      <div className="mb-2">Budget: ${project.budget}</div>
      <div className="mb-2">Technologies: {project.technologies?.join(', ')}</div>
      <div className="mb-2">Project Manager: {project.projectManager?.name} ({project.projectManager?.email})</div>
      <div className="mb-2">Assigned Engineers:</div>
      <ul className="list-disc ml-6">
        {project.assignedEngineers?.map((eng, idx) => (
          <li key={idx}>{eng.engineerId?.name} ({eng.role}, {eng.allocationPercentage}%)</li>
        ))}
      </ul>
      <div className="mt-6 flex gap-2">
        <button onClick={() => { setEditLoading(true); navigate(`/projects/${project._id}/edit`); }} className="bg-green-600 text-white px-4 py-2 rounded" disabled={editLoading}>{editLoading ? 'Loading...' : 'Edit'}</button>
        <button onClick={() => navigate('/projects')} className="bg-gray-400 text-white px-4 py-2 rounded">Back</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProjectView; 

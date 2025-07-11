import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { notifyError, notifySuccess } from '../utils';

const ProjectForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    priority: 'medium',
    budget: 0,
    technologies: '',
    projectManager: ''
  });
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    fetchManagers();
    if (isEdit) fetchProject();
  }, [id]);

  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://engineering-resourse-management.vercel.app/users/project-managers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setManagers(data.projectManagers || []);
      }
    } catch(error) {
      notifyError(error)
    }
  };

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://engineering-resourse-management.vercel.app/projects/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const p = data.project;
        setForm({
          name: p.name,
          description: p.description,
          startDate: p.startDate?.slice(0,10),
          endDate: p.endDate?.slice(0,10),
          priority: p.priority,
          budget: p.budget,
          technologies: p.technologies?.join(', '),
          projectManager: p.projectManager?._id || ''
        });
      }
    } catch(error) {
      notifyError(error)
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    const payload = {
      ...form,
      budget: Number(form.budget),
      technologies: form.technologies.split(',').map(t => t.trim())
    };
    try {
      const url = isEdit ? `https://engineering-resourse-management.vercel.app/projects/${id}` : 'https://engineering-resourse-management.vercel.app/projects';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        notifySuccess(data.message);
        setTimeout(() => navigate('/projects'), 1000);
      } else {
        notifyError(data.message);
      }
    } catch (err) {
      notifyError('Error saving project',err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-4">{isEdit ? 'Edit' : 'Create'} Project</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Project Name" className="w-full border p-2 rounded" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" required />
        <div className="flex gap-2">
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="border p-2 rounded w-1/2" required />
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="border p-2 rounded w-1/2" required />
        </div>
        <select name="priority" value={form.priority} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <input name="budget" type="number" value={form.budget} onChange={handleChange} placeholder="Budget" className="w-full border p-2 rounded" required />
        <input name="technologies" value={form.technologies} onChange={handleChange} placeholder="Technologies (comma separated)" className="w-full border p-2 rounded" />
        <select name="projectManager" value={form.projectManager} onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="">Select Project Manager</option>
          {managers.map(m => <option key={m._id} value={m._id}>{m.name} ({m.email})</option>)}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Saving...' : (isEdit ? 'Update' : 'Create')}</button>
        <button type="button" onClick={() => navigate('/projects')} className="bg-gray-400 text-white px-4 py-2 rounded ml-2">Cancel</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ProjectForm; 

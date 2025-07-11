import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { notifyError, notifySuccess } from '../utils';

const AssignmentForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    engineerId: '',
    projectId: '',
    role: 'developer',
    allocationPercentage: 100,
    startDate: '',
    endDate: '',
    hoursAllocated: 0,
    hourlyRate: 0,
    notes: ''
  });
  const [engineers, setEngineers] = useState([]);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    fetchEngineers();
    fetchProjects();
    if (isEdit) fetchAssignment();
  }, [id]);

  const fetchEngineers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/users/engineers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEngineers(data.engineers || []);
      }
    } catch(error) {
      notifyError(error)
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch(error) {
      notifyError(error)
    }
  };

  const fetchAssignment = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/assignments/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const a = data.assignment;
        setForm({
          engineerId: a.engineerId?._id || '',
          projectId: a.projectId?._id || '',
          role: a.role,
          allocationPercentage: a.allocationPercentage,
          startDate: a.startDate?.slice(0,10),
          endDate: a.endDate?.slice(0,10),
          hoursAllocated: a.hoursAllocated,
          hourlyRate: a.hourlyRate,
          notes: a.notes
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
    const token = localStorage.getItem('token');
    const payload = {
      ...form,
      allocationPercentage: Number(form.allocationPercentage),
      hoursAllocated: Number(form.hoursAllocated),
      hourlyRate: Number(form.hourlyRate)
    };
    try {
      const url = isEdit ? `http://localhost:8080/assignments/${id}` : 'http://localhost:8080/assignments';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        notifySuccess(data.message);
        setTimeout(() => navigate('/assignments'), 1000);
      } else {
        notifyError(data.message);
      }
    } catch (err) {
      notifyError('Error saving assignment',err);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-4">{isEdit ? 'Edit' : 'Create'} Assignment</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <select name="engineerId" value={form.engineerId} onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="">Select Engineer</option>
          {engineers.map(e => <option key={e._id} value={e._id}>{e.name} ({e.email})</option>)}
        </select>
        <select name="projectId" value={form.projectId} onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="">Select Project</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <select name="role" value={form.role} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="developer">Developer</option>
          <option value="lead">Lead</option>
          <option value="tester">Tester</option>
          <option value="analyst">Analyst</option>
        </select>
        <input name="allocationPercentage" value={form.allocationPercentage} onChange={handleChange} placeholder="Allocation %" className="w-full border p-2 rounded" type="number" min="0" max="100" />
        <div className="flex gap-2">
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="border p-2 rounded w-1/2" required />
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="border p-2 rounded w-1/2" required />
        </div>
        <input name="hoursAllocated" value={form.hoursAllocated} onChange={handleChange} placeholder="Hours Allocated" className="w-full border p-2 rounded" type="number" />
        <input name="hourlyRate" value={form.hourlyRate} onChange={handleChange} placeholder="Hourly Rate" className="w-full border p-2 rounded" type="number" />
        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="w-full border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{isEdit ? 'Update' : 'Create'}</button>
        <button type="button" onClick={() => navigate('/assignments')} className="bg-gray-400 text-white px-4 py-2 rounded ml-2">Cancel</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AssignmentForm; 

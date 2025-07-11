import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { notifyError, notifySuccess } from '../utils';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://erm-api.onrender.com/assignments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAssignments(data.assignments || []);
      } else {
        notifyError('Failed to fetch assignments');
      }
    } catch (error) {
      notifyError('Error loading assignments',error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://erm-api.onrender.com/assignments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        notifySuccess('Assignment deleted');
        fetchAssignments();
      } else {
        notifyError('Failed to delete assignment');
      }
    } catch (error) {
      notifyError('Error deleting assignment',error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Assignments</h1>
        <button onClick={() => navigate('/assignments/new')} className="bg-blue-600 text-white px-4 py-2 rounded">New Assignment</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr>
              <th className="p-2 border">Engineer</th>
              <th className="p-2 border">Project</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Allocation %</th>
              <th className="p-2 border">Start</th>
              <th className="p-2 border">End</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(a => (
              <tr key={a._id}>
                <td className="p-2 border">{a.engineerId?.name}</td>
                <td className="p-2 border">{a.projectId?.name}</td>
                <td className="p-2 border">{a.role}</td>
                <td className="p-2 border">{a.allocationPercentage}</td>
                <td className="p-2 border">{new Date(a.startDate).toLocaleDateString()}</td>
                <td className="p-2 border">{new Date(a.endDate).toLocaleDateString()}</td>
                <td className="p-2 border flex gap-2">
                  <button onClick={() => navigate(`/assignments/${a._id}`)} className="bg-blue-500 text-white px-2 py-1 rounded">View</button>
                  <button onClick={() => navigate(`/assignments/${a._id}/edit`)} className="bg-green-500 text-white px-2 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(a._id)} className="bg-red-500 text-white px-2 py-1 rounded" disabled={deletingId === a._id}>
                    {deletingId === a._id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Assignments; 

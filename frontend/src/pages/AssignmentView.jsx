import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { notifyError } from '../utils';

const AssignmentView = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://engineering-resourse-management.vercel.app/assignments/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAssignment(data.assignment);
      } else {
        notifyError('Failed to fetch assignment');
      }
    } catch (error) {
      notifyError('Error loading assignment',error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!assignment) return <div className="p-8 text-center">Assignment not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Assignment Details</h1>
      <div className="mb-2">Engineer: {assignment.engineerId?.name} ({assignment.engineerId?.email})</div>
      <div className="mb-2">Project: {assignment.projectId?.name}</div>
      <div className="mb-2">Role: {assignment.role}</div>
      <div className="mb-2">Allocation: {assignment.allocationPercentage}%</div>
      <div className="mb-2">Start: {new Date(assignment.startDate).toLocaleDateString()} | End: {new Date(assignment.endDate).toLocaleDateString()}</div>
      <div className="mb-2">Hours Allocated: {assignment.hoursAllocated}</div>
      <div className="mb-2">Hours Worked: {assignment.hoursWorked}</div>
      <div className="mb-2">Hourly Rate: ${assignment.hourlyRate}</div>
      <div className="mb-2">Notes: {assignment.notes}</div>
      <div className="mt-6 flex gap-2">
        <button onClick={() => navigate(`/assignments/${assignment._id}/edit`)} className="bg-green-600 text-white px-4 py-2 rounded">Edit</button>
        <button onClick={() => navigate('/assignments')} className="bg-gray-400 text-white px-4 py-2 rounded">Back</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AssignmentView; 

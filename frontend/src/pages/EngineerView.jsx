import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { notifyError } from '../utils';

const EngineerView = () => {
  const { id } = useParams();
  const [engineer, setEngineer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEngineer();
  }, [id]);

  const fetchEngineer = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://engineering-resourse-management.vercel.app/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEngineer(data.user);
      } else {
        notifyError('Failed to fetch engineer');
      }
    } catch (error) {
      notifyError('Error loading engineer',error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!engineer) return <div className="p-8 text-center">Engineer not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">{engineer.name}</h1>
      <div className="mb-2">Email: {engineer.email}</div>
      <div className="mb-2">Role: {engineer.role}</div>
      <div className="mb-2">Skills: {engineer.skills?.join(', ')}</div>
      <div className="mb-2">Experience: {engineer.experience} years</div>
      <div className="mb-2">Hourly Rate: ${engineer.hourlyRate}/hr</div>
      <div className="mb-2">Availability: {engineer.availability}</div>
      <div className="mb-2">Department: {engineer.department}</div>
      <div className="mb-2">Phone: {engineer.phone}</div>
      <div className="mb-2">Location: {engineer.location}</div>
      <div className="mb-2">Bio: {engineer.bio}</div>
      <div className="mt-6 flex gap-2">
        <button onClick={() => { setEditLoading(true); navigate(`/engineers/${engineer._id}/edit`); }} className="bg-green-600 text-white px-4 py-2 rounded" disabled={editLoading}>{editLoading ? 'Loading...' : 'Edit'}</button>
        <button onClick={() => navigate('/engineers')} className="bg-gray-400 text-white px-4 py-2 rounded">Back</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EngineerView; 

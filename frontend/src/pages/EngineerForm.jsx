import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { notifyError, notifySuccess } from '../utils';

const EngineerForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'engineer',
    skills: '',
    experience: 0,
    hourlyRate: 0,
    availability: 'available',
    department: 'Engineering',
    phone: '',
    location: '',
    bio: ''
  });
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) fetchEngineer();
  }, [id]);

  const fetchEngineer = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/users/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const u = data.user;
        setForm({
          ...form,
          name: u.name,
          email: u.email,
          password: '',
          role: u.role,
          skills: u.skills?.join(', '),
          experience: u.experience,
          hourlyRate: u.hourlyRate,
          availability: u.availability,
          department: u.department,
          phone: u.phone,
          location: u.location,
          bio: u.bio
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
      skills: form.skills.split(',').map(s => s.trim()),
      experience: Number(form.experience),
      hourlyRate: Number(form.hourlyRate)
    };
    if (!isEdit && !form.password) {
      notifyError('Password is required for new engineer');
      return;
    }
    if (isEdit) delete payload.password;
    try {
      const url = isEdit ? `http://localhost:8080/users/${id}` : 'http://localhost:8080/auth/signup';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        notifySuccess(data.message || 'Engineer saved');
        setTimeout(() => navigate('/engineers'), 1000);
      } else {
        notifyError(data.message);
      }
    } catch (err) {
      notifyError('Error saving engineer',err);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-4">{isEdit ? 'Edit' : 'Add'} Engineer</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border p-2 rounded" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded" required type="email" />
        {!isEdit && <input name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full border p-2 rounded" required type="password" />}
        <select name="role" value={form.role} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="engineer">Engineer</option>
          <option value="team_lead">Team Lead</option>
        </select>
        <input name="skills" value={form.skills} onChange={handleChange} placeholder="Skills (comma separated)" className="w-full border p-2 rounded" />
        <input name="experience" value={form.experience} onChange={handleChange} placeholder="Experience (years)" className="w-full border p-2 rounded" type="number" />
        <input name="hourlyRate" value={form.hourlyRate} onChange={handleChange} placeholder="Hourly Rate" className="w-full border p-2 rounded" type="number" />
        <select name="availability" value={form.availability} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="available">Available</option>
          <option value="partially_available">Partially Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
        <input name="department" value={form.department} onChange={handleChange} placeholder="Department" className="w-full border p-2 rounded" />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full border p-2 rounded" />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full border p-2 rounded" />
        <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Bio" className="w-full border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{isEdit ? 'Update' : 'Add'}</button>
        <button type="button" onClick={() => navigate('/engineers')} className="bg-gray-400 text-white px-4 py-2 rounded ml-2">Cancel</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EngineerForm; 

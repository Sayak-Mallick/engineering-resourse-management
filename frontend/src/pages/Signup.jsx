import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {ToastContainer} from 'react-toastify'
import { notifyError, notifySuccess } from '../utils';
const Signup = () => {

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value
    });
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    const { name, email, password, role } = signupData;
    if (!name || !email || !password || !role) {
      return notifySuccess("Please fill in all the required fields.");
    }
    try {
      const url = 'http://localhost:8080/auth/signup';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
      });
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        notifySuccess(message);
        setTimeout(() => {
          navigate('/login');
        },1000);
        setSignupData({
          name: '',
          email: '',
          password: '',
          role: ''
        });
      } else if (error) {
        const details = error?.details[0]?.message;
        notifyError(details);
      } else if (!success) {
        notifyError(message);
      }
       else {
        notifyError(message);
      }
    } catch (error) {
      notifyError("An error occurred during signup. Please try again later.");
      console.error("Signup error:", error);
    }
  };

  console.log("signupdata ->",signupData);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-16 py-12">
          <h2 className="text-4xl font-bold text-white text-center">Create Account</h2>
          <p className="text-blue-100 text-center mt-4 text-xl">Join us and get started today</p>
        </div>

        {/* Form */}
        <div className="p-16">
          <form className="space-y-10" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-800 tracking-tight">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                className="w-full px-8 py-5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none text-lg bg-gray-50/50 focus:bg-white hover:border-gray-300 shadow-sm focus:shadow-lg placeholder:text-gray-400"
                placeholder="Enter your full name"
                onChange={handleInputChange}
                value={signupData.name}
                required
              />
            </div>

            {/* Email Field */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-800 tracking-tight">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-8 py-5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none text-lg bg-gray-50/50 focus:bg-white hover:border-gray-300 shadow-sm focus:shadow-lg placeholder:text-gray-400"
                placeholder="Enter your email address"
                onChange={handleInputChange}
                value={signupData.email}
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-800 tracking-tight">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="w-full px-8 py-5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none text-lg bg-gray-50/50 focus:bg-white hover:border-gray-300 shadow-sm focus:shadow-lg placeholder:text-gray-400"
                placeholder="Create a strong password"
                onChange={handleInputChange}
                value={signupData.password}
                required
              />
            </div>

            {/* Role Field */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-800 tracking-tight">
                Role
              </label>
              <select
                name="role"
                onChange={handleInputChange}
                value={signupData.role}
                className="w-full px-8 py-5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none text-lg bg-gray-50/50 focus:bg-white hover:border-gray-300 shadow-sm focus:shadow-lg cursor-pointer"
                required
              >
                <option value="">Select your role</option>
                <option value="engineer">Engineer</option>
                <option value="project_manager">Project Manager</option>
                <option value="team_lead">Team Lead</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-6 px-8 rounded-xl font-bold text-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
            </button>
          </form>
          {/* Toast Container for Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          {/* Sign In Link */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 text-xl">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-500 font-bold text-xl underline hover:no-underline transition-all duration-200">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup

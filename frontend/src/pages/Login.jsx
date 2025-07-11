import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { notifyError, notifySuccess } from '../utils';

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { email, password } = loginData;

    if (!email || !password) {
      setLoading(false);
      return notifyError("Please enter both email and password.");
    }

    try {
      const response = await fetch('https://engineering-resourse-management.vercel.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      const result = await response.json();
      const { success, message, jwtToken, name, role, error } = result;
      if (success) {
        notifySuccess(message || 'Login successful!');
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggenInUser', name);
        localStorage.setItem('userRole', role);
        // Store token or user info if needed
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
        setLoginData({ email: '', password: '' });
      } else if (error) {
        const details = error?.details?.[0]?.message;
        notifyError(details || message || 'Login failed.');
      } else {
        notifyError(message || 'Login failed.');
      }

    } catch (err) {
      console.error("Login error:", err);
      notifyError("An error occurred during login. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-16 py-12">
          <h2 className="text-4xl font-bold text-white text-center">Welcome Back</h2>
          <p className="text-blue-100 text-center mt-4 text-xl">Login to your account</p>
        </div>

        {/* Form */}
        <div className="p-16">
          <form className="space-y-10" onSubmit={handleSubmit}>
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
                value={loginData.email}
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
                placeholder="Enter your password"
                onChange={handleInputChange}
                value={loginData.password}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-6 px-8 rounded-xl font-bold text-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
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

          {/* Sign Up Link */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 text-xl">
              Don’t have an account?{' '}
              <a href="/signup" className="text-blue-600 hover:text-blue-500 font-bold text-xl underline hover:no-underline transition-all duration-200">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

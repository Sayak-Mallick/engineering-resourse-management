import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { notifySuccess } from '../utils';

const Home = () => {
  const [loggedInUser, setLoggedInUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('loggenInUser');
    setLoggedInUser(user || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggenInUser');
    setLoggedInUser('');
    notifySuccess("You have successfully logged out.");
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 px-12 py-16 max-w-xl w-full text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome{loggedInUser ? `, ${loggedInUser}` : ''}!
        </h1>
        <p className="text-gray-600 text-lg">
          You're successfully logged in. Explore the platform or log out when you're done.
        </p>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-semibold text-xl py-4 px-8 rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-[0.98]"
        >
          Logout
        </button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Home;

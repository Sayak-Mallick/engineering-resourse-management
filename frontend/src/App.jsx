import './App.css'
import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import RefreshHandler from './RefreshHandler'
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const PrivateRoute = ({element}) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  }

  return (
    <>
      <RefreshHandler setAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={ <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="home" element={<PrivateRoute element={<Home />} />} />
      </Routes>
    </>
  )
}

export default App

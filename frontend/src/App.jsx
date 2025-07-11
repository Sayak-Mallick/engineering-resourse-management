import './App.css'
import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Engineers from './pages/Engineers'
import RefreshHandler from './RefreshHandler'
import ProjectView from './pages/ProjectView';
import ProjectForm from './pages/ProjectForm';
import EngineerForm from './pages/EngineerForm';
import EngineerView from './pages/EngineerView';
import AssignmentForm from './pages/AssignmentForm';
import AssignmentView from './pages/AssignmentView';
import Assignments from './pages/Assignments';
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
        <Route path="dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="projects" element={<PrivateRoute element={<Projects />} />} />
        <Route path="engineers" element={<PrivateRoute element={<Engineers />} />} />
        <Route path="projects/:id" element={<PrivateRoute element={<ProjectView />} />} />
        <Route path="projects/:id/edit" element={<PrivateRoute element={<ProjectForm />} />} />
        <Route path="projects/new" element={<PrivateRoute element={<ProjectForm />} />} />
        <Route path="engineers/:id" element={<PrivateRoute element={<EngineerView />} />} />
        <Route path="engineers/:id/edit" element={<PrivateRoute element={<EngineerForm />} />} />
        <Route path="engineers/new" element={<PrivateRoute element={<EngineerForm />} />} />
        <Route path="assignments" element={<PrivateRoute element={<Assignments />} />} />
        <Route path="assignments/:id" element={<PrivateRoute element={<AssignmentView />} />} />
        <Route path="assignments/:id/edit" element={<PrivateRoute element={<AssignmentForm />} />} />
        <Route path="assignments/new" element={<PrivateRoute element={<AssignmentForm />} />} />
      </Routes>
    </>
  )
}

export default App

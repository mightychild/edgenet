import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Badges from './components/Badges';
import Tasks from './components/Tasks';
import Referral from './components/Referral';
import Logout from './components/Logout';

const App = () => {
  return (
    
    <Router>
      
      <Routes>
        <Route element={<Navigate to="signup" />} path="/" />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/badges" element={<Badges />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/logout" element={<Logout />} />

      </Routes>
    </Router>
  );
};

export default App;
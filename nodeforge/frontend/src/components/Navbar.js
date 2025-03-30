import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaTasks, FaUser, FaShareAlt, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Get the current route

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  // Close navbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.navbar')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className={`navbar ${isOpen ? 'open' : ''}`}>
      {/* Toggle Icon for Mobile */}
      <button className="navbar-toggle" onClick={toggleNavbar}>
        {isOpen ? '×' : '☰'}
      </button>

      {/* Navbar Links */}
      <div className="navbar-links">
        <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <span className="nav-icon"><FaHome /></span>
          <span className="nav-text">Dashboard</span>
        </Link>
        <Link to="/tasks" className={`nav-link ${location.pathname === '/tasks' ? 'active' : ''}`}>
          <span className="nav-icon"><FaTasks /></span>
          <span className="nav-text">Missions</span>
        </Link>
        <Link to="/referral" className={`nav-link ${location.pathname === '/referral' ? 'active' : ''}`}>
          <span className="nav-icon"><FaShareAlt /></span>
          <span className="nav-text">Referral Program</span>
        </Link>
        <Link to="/badges" className={`nav-link ${location.pathname === '/badges' ? 'active' : ''}`}>
          <span className="nav-icon"><FaTasks /></span>
          <span className="nav-text">Medal & Boost</span>
        </Link>
        <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
          <span className="nav-icon"><FaUser /></span>
          <span className="nav-text">Profile</span>
        </Link>
        <Link to="/logout" className={`nav-link ${location.pathname === '/logout' ? 'active' : ''}`}>
          <span className="nav-icon"><FaSignOutAlt /></span>
          <span className="nav-text">Logout</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
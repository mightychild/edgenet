import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Logout.css'; // Import the CSS file

const Logout = () => {
  const [showConfirmation, setShowConfirmation] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('token'); // Remove the token from local storage
      setTimeout(() => navigate('/login'), 2000); // Redirect to login page after 2 seconds
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="logout-container">
      {showConfirmation ? (
        <div className="confirmation-dialog">
          <h1>Are you sure you want to log out?</h1>
          <div className="confirmation-buttons">
            <button onClick={handleLogout}>Yes, Log Out</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h1>Logging Out...</h1>
          <p>You are being logged out. Please wait...</p>
        </>
      )}
    </div>
  );
};

export default Logout;
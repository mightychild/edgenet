import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Profile.css';
import Navbar from './Navbar';
import Footer from './Footer';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    twitter: '',
    discord: '',
    wallet: '',
  });

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    
    <div className="profile-container">
      <Navbar />
      
      <h1>User Profile</h1>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-info">
          <div className="info-item">
            <span className="label">Name:</span>
            <span className="value">{user.name}</span>
          </div>
          <div className="info-item">
            <span className="label">Email:</span>
            <span className="value">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="label">Connected Twitter:</span>
            <span className="value">{user.twitter || 'Not connected'}</span>
          </div>
          <div className="info-item">
            <span className="label">Connected Discord:</span>
            <span className="value">{user.discord || 'Not connected'}</span>
          </div>
          <div className="info-item">
            <span className="label">Connected Wallet:</span>
            <span className="value">{user.walletAddress || 'Not connected'}</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
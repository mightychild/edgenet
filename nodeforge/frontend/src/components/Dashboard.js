// Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [nodeStatus, setNodeStatus] = useState('inactive'); // 'active' or 'inactive'
  const [uptime, setUptime] = useState(0);
  const [bandwidth, setBandwidth] = useState('0 GB');
  const [dataTransferred, setDataTransferred] = useState('0 GB');
  const [edgeBalance, setEdgeBalance] = useState(0);
  const [referralCode, setReferralCode] = useState('EDGE123');
  const [referralLink, setReferralLink] = useState('https://edgenet.com/ref/EDGE123');
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Track online/offline status

  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);

    // Fetch dashboard data from the backend
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNodeStatus(response.data.nodeStatus || 'inactive');
        setUptime(response.data.uptime || 0);
        setBandwidth(response.data.bandwidth || '0 GB');
        setDataTransferred(response.data.dataTransferred || '0 GB');
        setEdgeBalance(response.data.edgeBalance || 0);
        setReferralCode(response.data.referralCode || '');
        setReferralLink(response.data.referralLink || '');
        setTotalReferrals(response.data.totalReferrals || 0);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();

    // Add event listeners for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        
        <div className="header">
          <h1>Welcome back, User!</h1>
          <p>Here's your current status and performance.</p>
        </div>

        {/* Uptime, Bandwidth, and Node Status Section */}
        <div className="section combined-section">
          <div className="combined-card">
            <h2>Network Metrics</h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <h3>Uptime</h3>
                <p className="highlight">{uptime} seconds</p>
              </div>
              <div className="metric-card">
                <h3>Bandwidth Contribution</h3>
                <p className="highlight">{bandwidth}</p>
              </div>
            </div>
          </div>
          <div className="node-status-card-container">
            <div className={`node-status-card ${nodeStatus}`}>
              <h2>Node Status</h2>
              {/* <div className="network-indicator">
                <div className={`network-icon ${isOnline ? 'online' : 'offline'}`}>
                  <span className="icon">📶</span> Hotspot/Wi-Fi icon
                  <p>{isOnline ? 'Online' : 'Offline'}</p>
                </div>
              </div> */}
              <p>{nodeStatus === 'active' ? 'Node Connected' : 'Node Disconnected'}</p>
              <span className="status-indicator"></span>
            </div>
          </div>
        </div>

        {/* Rewards Section */}
        <div className="section">
          <h2>Rewards</h2>
          <div className="rewards-card">
            <h3>Points Balance</h3>
            <p className="highlight">{edgeBalance} Points</p>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${(edgeBalance / 1000) * 100}%` }}></div>
            </div>
          </div>
        </div>

        {/* Referral Program Section */}
        <div className="section">
          <h2>Referral Program</h2>
          <div className="referral-card">
            <p>Referral Code: <span className="highlight">{referralCode}</span></p>
            <p>Referral Link: <span className="highlight">{referralLink}</span></p>
            <p>Total Referrals: <span className="highlight">{totalReferrals}</span></p>
          </div>
        </div>
        <Footer />
      </div>
      
    </div>
  );
};

export default Dashboard;
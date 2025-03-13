import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [nodeStatus, setNodeStatus] = useState('Offline');
  const [uptime, setUptime] = useState(0);
  const [edgeBalance, setEdgeBalance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/points/extension-data', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNodeStatus(response.data.nodeActive ? 'Online' : 'Offline');
        setUptime(response.data.uptime);
        setEdgeBalance(response.data.edgeBalance);
      } catch (error) {
        console.error('Error fetching extension data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>EdgeNet Dashboard</h1>
      <p>Status: <span id="nodeStatus">{nodeStatus}</span></p>
      <p>Uptime: <span id="uptime">{uptime}</span> seconds</p>
      <p>$EDGE Balance: <span id="edgeBalance">{edgeBalance}</span></p>
    </div>
  );
};

export default Dashboard;
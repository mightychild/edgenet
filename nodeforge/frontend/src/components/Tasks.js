import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Tasks.css';

const Tasks = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [loadingDailyCheckIn, setLoadingDailyCheckIn] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [loadingTwitter, setLoadingTwitter] = useState(false);
  const [error, setError] = useState('');
  const [streak, setStreak] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [twitterConnected, setTwitterConnected] = useState(false);

  useEffect(() => {
    fetchUserData();
    reconnectWallet();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStreak(response.data.streak || 0);
      setLastCheckIn(response.data.lastCheckIn || null);
      setWalletConnected(response.data.walletAddress ? true : false);
      setTwitterConnected(response.data.twitter ? true : false);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const reconnectWallet = async () => {
    const storedWalletAddress = localStorage.getItem('walletAddress');
    if (storedWalletAddress) {
      try {
        setLoadingWallet(true);
        setError('');

        const token = localStorage.getItem('token');
        const nonceResponse = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const nonce = nonceResponse.data.nonce;

        const message = `Verify wallet ownership for EdgeNet. Nonce: ${nonce}`;
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, storedWalletAddress],
        });

        await axios.post(
          'http://localhost:5000/api/user/wallet/verify',
          { walletAddress: storedWalletAddress, signature },
          { headers: { Authorization: `Bearer ${token}` }}
        );

        setWalletAddress(storedWalletAddress);
        setWalletConnected(true);
      } catch (error) {
        console.error('Error reconnecting wallet:', error);
        setError('Failed to reconnect wallet. Please connect manually.');
        localStorage.removeItem('walletAddress');
      } finally {
        setLoadingWallet(false);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setLoadingWallet(true);
        setError('');

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const walletAddress = accounts[0];
        setWalletAddress(walletAddress);
        localStorage.setItem('walletAddress', walletAddress);

        const token = localStorage.getItem('token');
        const taskResponse = await axios.post(
          'http://localhost:5000/api/tasks',
          { type: 'wallet-connection', description: 'Connect your wallet' },
          { headers: { Authorization: `Bearer ${token}` }}
        );

        await axios.put(
          `http://localhost:5000/api/tasks/${taskResponse.data.task._id}/complete`,
          {},
          { headers: { Authorization: `Bearer ${token}` }}
        );

        const userResponse = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setWalletConnected(true);
        alert('Wallet connected successfully! You earned 50 $EDGE points.');
      } catch (error) {
        console.error('Error connecting wallet:', error);
        setError('Failed to connect wallet. Please try again.');
      } finally {
        setLoadingWallet(false);
      }
    } else {
      setError('Please install MetaMask or another Ethereum wallet.');
    }
  };

  const handleDailyCheckIn = async () => {
    try {
      setLoadingDailyCheckIn(true);
      setError('');

      const token = localStorage.getItem('token');
      const taskResponse = await axios.post(
        'http://localhost:5000/api/tasks',
        { type: 'daily-check-in', description: 'Complete daily check-in' },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      const completeResponse = await axios.put(
        `http://localhost:5000/api/tasks/${taskResponse.data.task._id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );

      const userResponse = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStreak(userResponse.data.streak);
      setLastCheckIn(userResponse.data.lastCheckIn);
      alert('Daily check-in successful! You earned 100 $EDGE points.');
    } catch (error) {
      console.error('Error during daily check-in:', error);
      alert(error.response?.data?.error || 'Failed to check in.');
    } finally {
      setLoadingDailyCheckIn(false);
    }
  };

  const connectTwitter = async () => {
    try {
      setLoadingTwitter(true);
      setError('');

      const token = localStorage.getItem('token');
      const taskResponse = await axios.post(
        'http://localhost:5000/api/tasks',
        { type: 'twitter-connection', description: 'Connect your Twitter account' },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      await axios.put(
        `http://localhost:5000/api/tasks/${taskResponse.data.task._id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );

      const userResponse = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTwitterConnected(true);
      alert('Twitter connected successfully! You earned 50 $EDGE points.');
    } catch (error) {
      console.error('Error connecting Twitter:', error);
      setError('Failed to connect Twitter. Please try again.');
    } finally {
      setLoadingTwitter(false);
    }
  };

  const truncateWalletAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      <Navbar />
      <div className="tasks-container">
        <h1>Tasks</h1>
        
        <div className="tasks-list">
          {/* Daily Check-In Task Card */}
          <div className="task-card">
            <div className="task-card-content">
              <h3>Daily Check-In</h3>
              <p>Streak: {streak} days</p>
              <p>Last Check-In: {lastCheckIn ? new Date(lastCheckIn).toLocaleDateString() : 'Never'}</p>
            </div>
            <button
              onClick={handleDailyCheckIn}
              disabled={loadingDailyCheckIn || loadingWallet || loadingTwitter}
            >
              {loadingDailyCheckIn ? (
                <>
                  <span className="spinner"></span> Checking In...
                </>
              ) : (
                'Check In'
              )}
            </button>
          </div>

          {/* Wallet Connection Task Card */}
          <div className="task-card">
            <div className="task-card-content">
              <h3>Connect Wallet</h3>
              <p>Earn 50 $EDGE for connecting your wallet.</p>
              {walletConnected && (
                <p className="wallet-address">
                  Connected: {truncateWalletAddress(walletAddress)}
                </p>
              )}
            </div>
            <button
              onClick={connectWallet}
              disabled={loadingWallet || loadingDailyCheckIn || loadingTwitter || walletConnected}
            >
              {loadingWallet ? (
                <>
                  <span className="spinner"></span> Connecting...
                </>
              ) : (
                walletConnected ? 'Connected' : 'Connect'
              )}
            </button>
          </div>

          {/* Twitter Connection Task Card */}
          <div className="task-card">
            <div className="task-card-content">
              <h3>Connect Twitter</h3>
              <p>Earn 50 $EDGE for connecting your Twitter account.</p>
              {twitterConnected && (
                <p className="twitter-connected">
                  Connected: @{twitterConnected}
                </p>
              )}
            </div>
            <button
              onClick={connectTwitter}
              disabled={loadingTwitter || loadingDailyCheckIn || loadingWallet || twitterConnected}
            >
              {loadingTwitter ? (
                <>
                  <span className="spinner"></span> Connecting...
                </>
              ) : (
                twitterConnected ? 'Connected' : 'Connect'
              )}
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>
      
      <div id="footer">
        <Footer />
      </div>
    </>
  );
};

export default Tasks;
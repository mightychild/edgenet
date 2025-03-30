import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCopy } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Referral.css';

const Referral = () => {
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [referralPoints, setReferralPoints] = useState(0);

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/referral', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReferralCode(response.data.referralCode);
        setReferralLink(response.data.referralLink);
        setTotalReferrals(response.data.totalReferrals);
        setReferralPoints(response.data.referralPoints || 0);
      } catch (error) {
        console.error('Error fetching referral data:', error);
      }
    };

    fetchReferralData();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  return (
    <>
      <Navbar />
      <div className="referral-container">
        <h1>Referral Program</h1>

        {/* Parent Card for Referral Code and Link */}
        <div className="parent-card">
          <h2>Your Referral Information</h2>
          <div className="child-cards-container">
            {/* Referral Code Card */}
            <div className="child-card">
              <h3>Referral Code</h3>
              <div className="referral-highlight">
                <span>{referralCode}</span>
                <button
                  className="copy-button"
                  onClick={() => copyToClipboard(referralCode)}
                  aria-label="Copy referral code"
                >
                  <FaCopy />
                </button>
              </div>
            </div>

            {/* Referral Link Card */}
            <div className="child-card">
              <h3>Referral Link</h3>
              <div className="referral-highlight">
                <a href={referralLink} target="_blank" rel="noopener noreferrer">
                  {referralLink}
                </a>
                <button
                  className="copy-button"
                  onClick={() => copyToClipboard(referralLink)}
                  aria-label="Copy referral link"
                >
                  <FaCopy />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Parent Card for Referral Stats */}
        <div className="parent-card">
          <h2>Your Referral Progress</h2>
          <div className="child-cards-container">
            {/* Referral Points Card */}
            <div className="child-card">
              <h3>Referral Points</h3>
              <div className="referral-highlight">
                <span>{referralPoints}</span>
              </div>
            </div>

            {/* Total Referrals Card */}
            <div className="child-card">
              <h3>Total Referrals</h3>
              <div className="referral-highlight">
                <span>{totalReferrals}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div id="footer">
        <Footer />
      </div>
    </>
  );
};

export default Referral;
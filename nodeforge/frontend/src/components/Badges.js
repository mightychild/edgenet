import React from 'react';
import '../styles/Badges.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Badges = () => {
  const badges = [
    { 
      name: 'Bandwidth Provider', 
      description: 'Achieve 1 TB of bandwidth contribution', 
      image: 'https://via.placeholder.com/60' 
    },
    { 
      name: 'Uptime Champion', 
      description: 'Achieve 1000 hours of uptime', 
      image: 'https://via.placeholder.com/60' 
    },
    { 
      name: 'Referral Master', 
      description: 'Refer 10 users', 
      image: 'https://via.placeholder.com/60' 
    },
    { 
      name: 'Human Verified', 
      description: 'Complete human verification', 
      image: 'https://via.placeholder.com/60' 
    },
    { 
      name: '$EDGE Holder', 
      description: 'Hold 1000 $EDGE tokens', 
      image: 'https://via.placeholder.com/60' 
    },
  ];

  return (
    <div className="badges-container">
      <Navbar />
      <div className="badges-content">
        <h1>Badges</h1>
        <p>Earn badges by reaching specific milestones!</p>
        <div className="badges-flex-container">
          <div className="badges-flex">
            {badges.map((badge, index) => (
              <div key={index} className="badge">
                <img src={badge.image} alt={badge.name} />
                <h3>{badge.name}</h3>
                <p>{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div id="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Badges;
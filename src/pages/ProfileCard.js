import React from 'react';
import './ProfileCard.css';

const ProfileCard = () => {
  return (
    <div className="profile-card">
      <div className="profile-header">
        <img 
          src="./assets/pavi.jpg" 
          alt="Profile" 
          className="profile-image" 
        />
        <div className="profile-details">
          <h3 className="profile-name">R.pavithra</h3>
          <p className="profile-role">IT TOP-UP STUDENT</p>
          <p className="profile-contact">0775674657 | pavi@gmail.com</p>
        </div>
      </div>
      <div className="attendance-stats">
        <div className="circle">
          <h2>90%</h2>
        </div>
        <div className="stats">
          <p><span className="red">1</span> Absent</p>
          <p><span className="green">17</span> Present</p>
          <p><span className="orange">2</span> Late(AM)</p>
          <p><span className="orange">1</span> Late(PM)</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

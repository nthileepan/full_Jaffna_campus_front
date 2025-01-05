import React from 'react';
import './NotesSection.css';

const NotesSection = () => {
  return (
    <div className="notes-section">
      <h3>Write a note...</h3>
      <textarea placeholder="Type here..."></textarea>
      <div className="note">
        <p>Note 1</p>
      </div>
      <div className="note">
        <p>Note 2</p>
      </div>
    </div>
  );
};

export default NotesSection;

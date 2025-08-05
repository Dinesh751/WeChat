import React from 'react';
import './DefaultPage.css';

const DefaultPage = () => {
  return (
    <div className="default-page-container">
      <div className="default-page-content">
        <h1>Welcome to WeChat</h1>
        <p>Select a user to start chatting and enjoy seamless communication!</p>
        <div className="default-page-svg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-message-circle"
            style={{ width: '200px', height: '200px', color: '#6a11cb' }}
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 11h4M8 15h8M8 7h8"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DefaultPage;
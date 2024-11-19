import React from 'react';

const LandingPage = ({ onNavigateToCalendar, username, onLogout }) => (
  <div>
    <h1>Welcome to Flex Forge, {username}!</h1>
    <button onClick={onNavigateToCalendar}>Go to Calendar</button>
    <button onClick={onLogout}>Logout</button>
  </div>
);

export default LandingPage;

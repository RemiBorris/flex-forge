import React from 'react';

const LandingPage = ({ onNavigateToCalendar, userId, onLogout }) => (
  <div>
    <h1>Welcome to Flex Forge, {userId}!</h1>
    <button onClick={onNavigateToCalendar}>Go to Calendar</button>
    <button onClick={onLogout}>Logout</button>
  </div>
);

export default LandingPage;

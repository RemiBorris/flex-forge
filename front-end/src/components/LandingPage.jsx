import React from 'react';

const LandingPage = ({ onNavigateToCalendar, username, onLogout, onNavigateToNewRoutine, onNavigateToNewExercise }) => (
  <div>
    <h1>Welcome to Flex Forge</h1>
    <button onClick={onNavigateToCalendar}>Go to Calendar</button>
    <button onClick={onNavigateToNewRoutine}>Create New Routine</button>
    <button onClick={onNavigateToNewExercise}>Create New Exercise</button>
    <button onClick={onLogout}>Logout</button>
  </div>
);

export default LandingPage;

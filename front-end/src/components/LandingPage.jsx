import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for API calls

const LandingPage = ({ onNavigateToCalendar, onLogout, onNavigateToNewRoutine, onNavigateToNewExercise }) => {
  const [routines, setRoutines] = useState([]); // State to store the list of routines

  // Get the userId from localStorage
  const userId = localStorage.getItem("userId");
  
  // Fetch routines when the component mounts
  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}/workouts/routines`);
        setRoutines(response.data); // Update state with the fetched routines
      } catch (error) {
        console.error('Error fetching routines:', error);
      }
    };

    fetchRoutines();
  }, [userId]); // Re-fetch routines whenever userId changes

  // Handle clicking on a routine name
  const handleRoutineClick = (routineName) => {
    console.log('Routine clicked:', routineName);
    // Later, you can implement viewing the routine details here
  };

  return (
    <div>
      <h1>Welcome to Flex Forge</h1>
      <button onClick={onNavigateToCalendar}>Go to Calendar</button>
      <button onClick={onNavigateToNewRoutine}>Create New Routine</button>
      <button onClick={onNavigateToNewExercise}>Create New Exercise</button>
      <button onClick={onLogout}>Logout</button>

      <h2>Your Routines:</h2>
      <ul>
        {routines.map((routine) => (
          <li key={routine.id}>
            <button onClick={() => handleRoutineClick(routine.routine_name)}>
              {routine.routine_name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LandingPage;


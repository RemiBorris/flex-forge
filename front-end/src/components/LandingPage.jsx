import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for API calls
import { FaEdit } from 'react-icons/fa';

const LandingPage = ({
  onNavigateToCalendar,
  onLogout,
  onNavigateToNewRoutine,
  onNavigateToNewExercise,
  onNavigateToWorkoutDetails,
  onNavigateToProfilePage,
  onNavigateToEditRoutine,
  selectedDate // Receive the selected date from props
}) => {
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

  const handleRoutineClick = async (routine) => {
    try {
      // Use the selected date passed from the calendar
      const today = new Date()
      let date = selectedDate || today
      date = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD

      console.log('Sending request with data:', {
        routine_id: routine.id,
        date: date
      });
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/${userId}/workouts/create_scheduled_workout`, {
        routine_id: routine.id,
        date: date, // Use the selected date
      });
      const scheduledWorkout = response.data; // Get the newly created workout
      alert(`Routine "${routine.routine_name}" scheduled for ${date}!`);
      
      // Navigate to the WorkoutDetails view with the scheduled workout
      onNavigateToWorkoutDetails(scheduledWorkout);
    } catch (error) {
      console.error('Error scheduling routine:', error);
      alert('Failed to schedule routine');
    }
  };

  return (
    <div>
      <h1>Welcome to Flex Forge, {localStorage.userName}!</h1>
      <button onClick={onNavigateToCalendar}>Go to Calendar</button>
      <button onClick={onNavigateToNewRoutine}>Create New Routine</button>
      <button onClick={onNavigateToNewExercise}>Create New Exercise</button>
      <button onClick={onNavigateToProfilePage}>Profile Page</button>
      <button onClick={onLogout}>Logout</button>

      <h2>Your Routines:</h2>
      <ul>
        {routines.map((routine) => (
          <li key={routine.id}>
            <button onClick={() => handleRoutineClick(routine)}>
              {routine.routine_name}
            </button>
            <FaEdit
            onClick={() => onNavigateToEditRoutine(routine.id)}
            style={{ cursor: "pointer", color: "#555" }}/>
           {/* <button onClick={() => handleDeleteRoutine(routine.id)}> 
              Delete
        </button> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LandingPage;
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for API calls
import { FaEdit } from 'react-icons/fa';
import '../styles/LandingPage.css';
import { UserCircleIcon, CalendarDaysIcon, PlusCircleIcon } from '@heroicons/react/24/solid';
import { MdLogout } from "react-icons/md";




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
  const [avatar, setAvatar] = useState(localStorage.getItem("userAvatar") || null); // Retrieve avatar from localStorage


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
    <div className="main-content">
      
      <nav className="nav-bar">

      <button className="nav-btn" onClick={onNavigateToProfilePage}>
          {avatar ? (
            <img
              src={avatar}
              alt="User Avatar"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%', // Circular avatar
                objectFit: 'cover', // Crop to fit the square
              }}
            />
          ) : (
            <UserCircleIcon style={{ width: '34px', height: '34px' }} />
          )}
        </button>

      <button className="nav-btn" onClick={onNavigateToCalendar}>
      <CalendarDaysIcon style={{ width: '34px', height: '34px', color: 'white' }} />

      </button>

      <button className="nav-btn" onClick={onLogout}>
      <MdLogout style={{ width: '34px', height: '34px', color: 'white' }} />
      </button>
      </nav>

      
      

      <h2>Your Routines:</h2>
      <ul className="routines-list">
        {routines.map((routine) => (
          <li key={routine.id}>
            <button
              className="routine-btn"
              onClick={() => handleRoutineClick(routine)}
            >
              {routine.routine_name}
            </button>
            <FaEdit
              className="edit-icon"
              onClick={() => onNavigateToEditRoutine(routine.id)}
            />
          </li>
        ))}
      </ul>
      <button className="landing-btn" onClick={onNavigateToNewRoutine}>
      <PlusCircleIcon style={{ width: '44px', height: '44px', color: 'white' }} />
      </button>
      <button className="landing-btn" onClick={onNavigateToNewExercise}>Create New Exercise</button>
    </div>
  );
};

export default LandingPage;
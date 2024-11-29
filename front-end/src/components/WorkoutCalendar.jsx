import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import '../styles/WorkoutCalendar.css'; 
import WorkoutDetails from './WorkoutDetails';

const WorkoutCalendar = ({ userId, onNavigateToLanding }) => {
  const [workoutMap, setWorkoutMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch workouts and map them to dates
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/users/${localStorage.userId}/workouts`)
      .then(({ data }) => {
        const map = data.reduce((acc, workout) => {
          const dateKey = new Date(workout.date).toISOString().split('T')[0]; // Use YYYY-MM-DD
          acc[dateKey] = workout; // Directly assign the workout object
          return acc;
        }, {});
        setWorkoutMap(map); //saves mapped workouts
      });
  }, [userId]);


  const handleWorkoutDeleted = (deletedDate) => {
    try {
      const updatedWorkoutMap = { ...workoutMap };
      const dateKey = new Date(deletedDate).toISOString().split('T')[0]; // Convert to YYYY-MM-DD
      delete updatedWorkoutMap[dateKey]; // Remove workout from the map
      setWorkoutMap(updatedWorkoutMap); // Update the state to reflect the removal
    } catch (error) {
      // Log the error but continue execution
      console.error("Error deleting workout due to invalid date:", error);
    }
  };

  // Render dots for workout days
  const tileContent = ({ date }) => {
    const dateKey = date.toISOString().split('T')[0];
    return workoutMap[dateKey] ? <div className="dot" /> : null;
  };

  return (
    <div>
      <button onClick={onNavigateToLanding}>Back to Landing Page</button>
      {selectedDate && workoutMap[selectedDate.toISOString().split('T')[0]] ? (
        <WorkoutDetails
           workouts={workoutMap[selectedDate.toISOString().split('T')[0]]}
          onBack={handleWorkoutDeleted}
        />
      ) : (
        <Calendar
        onClickDay={(date) => {
          const dateKey = date.toISOString().split('T')[0];
          // Only set the selected date if there are workouts for that day
          if (workoutMap[dateKey]) {
            setSelectedDate(date);
          }
        }}
          tileContent={tileContent}
        />
      )}
    </div>
  );
};

export default WorkoutCalendar;



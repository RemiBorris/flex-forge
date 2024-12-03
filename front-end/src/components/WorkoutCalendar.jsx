import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import '../styles/WorkoutCalendar.css'; 
import WorkoutDetails from './WorkoutDetails';

const WorkoutCalendar = ({ onNavigateToLanding }) => {
  const [workoutMap, setWorkoutMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch workouts and map them to dates
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/users/${localStorage.userId}/workouts`)
      .then(({ data }) => {
        const map = data.reduce((acc, workout) => {
          const dateKey = new Date(workout.date).toISOString().split('T')[0]; // Use YYYY-MM-DD
          acc[dateKey] = workout; // Map workouts by date
          return acc;
        }, {});
        setWorkoutMap(map); // Save the mapped workouts
      });
  }, []);

  const handleWorkoutDeleted = (deletedDate, isFullDeletion) => {
    if (!deletedDate) return;
  
    if (isFullDeletion) {
      // Remove the date entirely
      const updatedWorkoutMap = { ...workoutMap };
      const dateKey = new Date(deletedDate).toISOString().split('T')[0];
      delete updatedWorkoutMap[dateKey];
      setWorkoutMap(updatedWorkoutMap);
    } else {
      // Just re-fetch workouts from the backend for the latest state
      axios.get(`${process.env.REACT_APP_API_URL}/users/${localStorage.userId}/workouts`)
        .then(({ data }) => {
          const map = data.reduce((acc, workout) => {
            const dateKey = new Date(workout.date).toISOString().split('T')[0];
            acc[dateKey] = workout;
            return acc;
          }, {});
          setWorkoutMap(map);
        });
    }
  };

  // Render dots for workout days
  const tileContent = ({ date }) => {
    const dateKey = date.toISOString().split('T')[0]; 
    return workoutMap[dateKey] ? <div className="dot" /> : null;
  };

  // Updated onClickDay to navigate to LandingPage if the day is empty
  const handleEmptyDayClick = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    if (!workoutMap[dateKey]) {
      onNavigateToLanding(dateKey); // Pass the selected date to LandingPage
    } else {
      setSelectedDate(date); // Open workout details if a workout exists
    }
  };

  return (
    <div className="container">
      <button className="button" onClick={onNavigateToLanding}>Back</button>
      {selectedDate && workoutMap[selectedDate.toISOString().split('T')[0]] ? (
        <WorkoutDetails
          workouts={workoutMap[selectedDate.toISOString().split('T')[0]]}
          onBack={(deletedDate, isFullDeletion) => {
            handleWorkoutDeleted(deletedDate, isFullDeletion);
            setSelectedDate(null); // Reset the selected date to return to the calendar view
          }}
        />
      ) : (
        <div className="calendarContainer">
          <Calendar
            onClickDay={handleEmptyDayClick}
            tileContent={tileContent}
          />
        </div>
      )}
    </div>
  );
  
};

export default WorkoutCalendar;
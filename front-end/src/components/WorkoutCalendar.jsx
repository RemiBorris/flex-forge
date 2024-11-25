import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import '../styles/WorkoutCalendar.css'; 
import UserWorkouts from './UserWorkouts';
import WorkoutDetails from './WorkoutDetails';

const WorkoutCalendar = ({ userId, onNavigateToLanding }) => {
  const [workoutMap, setWorkoutMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch workouts and map them to dates
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/users/${localStorage.userId}/workouts`)
      .then(({ data }) => {
        const map = data.reduce((acc, workout) => {
          const dateKey = new Date(workout.date).toDateString();
          acc[dateKey] = workout; // Directly assign the workout object
          return acc;
        }, {});
        setWorkoutMap(map); //saves mapped workouts
      });
  }, [userId]);

  // Render dots for workout days
  const tileContent = ({ date }) =>
    workoutMap[date.toDateString()] ? <div className="dot" /> : null;

  return (
    <div>
      <button onClick={onNavigateToLanding}>Back to Landing Page</button>
      {selectedDate && workoutMap[selectedDate.toDateString()] ? (
        <WorkoutDetails
          workouts={workoutMap[selectedDate.toDateString()]}
          onBack={() => setSelectedDate(null)}
        />
      ) : (
        <Calendar
        onClickDay={(date) => {
          // Only set the selected date if there are workouts for that day
          if (workoutMap[date.toDateString()]) {
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



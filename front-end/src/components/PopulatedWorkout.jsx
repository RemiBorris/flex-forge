import React from 'react';

const PopulatedWorkout = ({ selectedDate }) => {
  // Placeholder workout data (you can replace this with actual data later)
  const workoutForTheDay = {
    name: "Leg Day",
    exercises: [
      { name: "Squats", sets: 4, reps: 12 },
      { name: "Lunges", sets: 3, reps: 10 },
      { name: "Leg Press", sets: 4, reps: 10 }
    ]
  };

  return (
    <div className="daily-workout">
      <h3>Workout for {selectedDate.toDateString()}</h3>
      <h4>{workoutForTheDay.name}</h4>
      <ul>
        {workoutForTheDay.exercises.map((exercise, index) => (
          <li key={index}>
            <strong>{exercise.name}</strong>: {exercise.sets} sets x {exercise.reps} reps
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopulatedWorkout;

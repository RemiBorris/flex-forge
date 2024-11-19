import React from 'react';

const UserWorkouts = ({ workouts, onBack }) => (
  <div>
    <button onClick={onBack}>Back</button>
    <h2>Workout Details</h2>
    <ul>
      {workouts.map((workout) => (
        <li key={workout.id}>
          <strong>Date:</strong> {new Date(workout.date).toLocaleDateString()}
          <ul>
            {workout.workout_exercises.map((exercise) => (
              <li key={exercise.id}>
                {exercise.exercise.name} - {exercise.exercise.muscle_group}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </div>
);

export default UserWorkouts;



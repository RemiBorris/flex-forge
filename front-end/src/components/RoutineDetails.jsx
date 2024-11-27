import React from "react";

const RoutineDetails = ({ routine, onNavigateToLanding }) => {

  if (!routine || !routine.workout_exercises_attributes) {
    return (
      <div>
        <button onClick={onNavigateToLanding}>Back to Landing Page</button>
        <h1>Routine Details</h1>
        <p>No exercises available for this routine.</p>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onNavigateToLanding}>Back to Landing Page</button>
      <h1>Routine Details</h1>
      <h2>{routine.routine_name}</h2>
      <h3>Exercises:</h3>
      <ul>
        {routine.workout_exercises_attributes.map((exercise, index) => (
          <li key={index}>
            <h4>{exercise.exercise_name}</h4>
            <p>Sets: {exercise.set_entries_attributes.length}</p>
            {exercise.set_entries_attributes.map((set, idx) => (
              <p key={idx}>
                Set {set.set_number}: {set.reps} reps at {set.weight} lbs
              </p>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoutineDetails;
import axios from "axios";
import React, { useEffect, useState } from "react";

const WorkoutDetails = ({ workouts, onBack, onNavigateToLanding }) => {
  const [workoutData, setWorkoutData] = useState(null); // Start with null to represent loading

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/${localStorage.userId}/workouts/${workouts.id}`)
      .then((response) => {
        setWorkoutData(response.data); // Adjust to match API structure
      })
      .catch((error) => {
        console.error("Error fetching workout details:", error);
        setWorkoutData(null); // Set state to indicate error
      });
  }, [workouts.id]); // Re-fetch if workouts.id changes

  if (workoutData === null) {
    return <p>Loading workout details...</p>; // Handle loading or error
  }

  return (
    <div>
      <h2>Workout Details</h2>
      <p>
        <strong>Date:</strong>{" "}
        {workouts.date ? new Date(workouts.date).toLocaleDateString() : "Unknown"}
        <br/>
        <strong>Notes:</strong>{" "}
        {workouts.notes}
      </p>

      <h3>Exercises</h3>
      {workoutData.workout_exercises ? (
        <ul>
          {workoutData.workout_exercises.map((workoutExercise) => (
            <li key={workoutExercise.id}>
              <h4>{workoutExercise.exercise.name}</h4>
              <table>
                <thead>
                  <tr>
                    {/* <th>Set</th> */}
                    <th>Reps</th>
                    <th>Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {workoutExercise.set_entries.map((set) => (
                    <tr key={set.id}>
                      {/* <td>{set.set_number}</td> */}
                      <td>{set.reps}</td>
                      <td>{set.weight} lbs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </li>
          ))}
        </ul>
      ) : (
        <p>No exercises available for this workout.</p>
      )}
      {/* Add the back button here */}
      <button onClick={onBack}>Back to Calendar</button>

    </div>
  );
};

export default WorkoutDetails;
import React, { useState, useEffect } from "react";
import axios from "axios";

const WorkoutDetails = ({ workouts, onBack }) => {
  const [editMode, setEditMode] = useState(false); // Tracks whether we are in edit mode
  const [workoutData, setWorkoutData] = useState(null); // Initially null to indicate loading state
  const [errors, setErrors] = useState(null); // Tracks any errors

  useEffect(() => {
    // Fetch workout details from the backend
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/${localStorage.userId}/workouts/${workouts.id}`)
      .then((response) => {
        setWorkoutData(response.data); // Populate workout data
      })
      .catch((error) => {
        console.error("Error fetching workout details:", error);
        setErrors("Failed to load workout details.");
      });
  }, [workouts.id]);

  // Function to handle adding a new set to a specific exercise
  const handleAddSet = (exerciseId) => {
    if (!workoutData) return; // Ensure data exists
    const updatedWorkout = JSON.parse(JSON.stringify(workoutData)); // Deep clone
    const exercise = updatedWorkout.workout_exercises.find(
      (ex) => ex.id === exerciseId
    );
    exercise.set_entries.push({ reps: 0, weight: 0, id: Date.now() }); // Temporary ID for new set
    setWorkoutData(updatedWorkout);
  };

  // Function to handle deleting a set
  const handleDeleteSet = (exerciseId, setId) => {
    if (!workoutData) return; // Ensure data exists

    // Deep clone workoutData to ensure React detects the state change
    const updatedWorkout = JSON.parse(JSON.stringify(workoutData));
    const exercise = updatedWorkout.workout_exercises.find((ex) => ex.id === exerciseId);

    if (!exercise) return; // No exercise found

    const set = exercise.set_entries.find((set) => set.id === setId);
    if (set) {
      set._destroy = true; // Mark set for deletion
    } else {
      // If set is newly created (no ID), remove it directly
      exercise.set_entries = exercise.set_entries.filter((set) => set.id !== setId);
    }

    setWorkoutData(updatedWorkout); // Update state to trigger re-render
  };

  // Function to handle input changes for reps and weight
  const handleInputChange = (exerciseId, setId, field, value) => {
    if (!workoutData) return; // Ensure data exists
    const updatedWorkout = JSON.parse(JSON.stringify(workoutData)); // Deep clone
    const exercise = updatedWorkout.workout_exercises.find(
      (ex) => ex.id === exerciseId
    );
    const set = exercise.set_entries.find((set) => set.id === setId);
    set[field] = value; // Update the specific field (reps or weight)
    setWorkoutData(updatedWorkout);
  };

  // Function to save changes to the backend
  const handleSaveChanges = async () => {
    if (!workoutData) return; // Ensure data exists

    const payload = {
      workout: {
        date: workoutData.date,
        workout_exercises_attributes: workoutData.workout_exercises.map((exercise) => ({
          id: exercise.id,
          exercise_id: exercise.exercise.id,
          set_entries_attributes: exercise.set_entries
            .filter((set) => !set._destroy || set.id) // Include only valid sets for backend
            .map((set) => ({
              id: set.id || null,
              set_number: set.set_number,
              reps: set.reps,
              weight: set.weight,
              _destroy: set._destroy || false,
            })),
        })),
      },
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/${localStorage.userId}/workouts/${workoutData.id}`,
        payload
      );
      setWorkoutData(response.data); // Sync state with backend response
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error("Error saving workout:", error);
      setErrors("Failed to save changes. Please try again.");
    }
  };

  // Function to handle deleting the workout
  const handleDeleteWorkout = () => {
    if (!workoutData) return; // Ensure data exists
    if (window.confirm("Are you sure you want to delete this workout? This action cannot be undone.")) {
      axios
        .delete(
          `${process.env.REACT_APP_API_URL}/users/${localStorage.userId}/workouts/${workoutData.id}`
        )
        .then(() => {
          onBack(); // Navigate back to the main page
        })
        .catch((error) => {
          console.error("Error deleting workout:", error);
          setErrors("Failed to delete workout. Please try again.");
        });
    }
  };

  // Handle loading and error states
  if (!workoutData) {
    return <p>{errors || "Loading workout details..."}</p>;
  }

  // Render workout details in view or edit mode
  return (
    <div>
      <h2>Workout Details</h2>
      <p>
        <strong>Date:</strong>{" "}
        {workoutData.date
          ? new Date(workoutData.date).toLocaleDateString()
          : "Unknown"}
        <br />
        <strong>Notes:</strong> {workoutData.notes}
      </p>

      <h3>Exercises</h3>
      {errors && <p style={{ color: "red" }}>{errors}</p>}
      {workoutData.workout_exercises.map((exercise) => (
        <div key={exercise.id}>
          <h4>{exercise.exercise.name}</h4>
          {editMode ? (
            <table>
              <thead>
                <tr>
                  <th>Reps</th>
                  <th>Weight</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exercise.set_entries
                  .filter((set) => !set._destroy) // Exclude sets marked for deletion
                  .map((set) => (
                    <tr key={set.id}>
                      <td>
                        <input
                          type="number"
                          value={set.reps}
                          onChange={(e) =>
                            handleInputChange(
                              exercise.id,
                              set.id,
                              "reps",
                              parseInt(e.target.value, 10)
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={set.weight}
                          onChange={(e) =>
                            handleInputChange(
                              exercise.id,
                              set.id,
                              "weight",
                              parseInt(e.target.value, 10)
                            )
                          }
                        />
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteSet(exercise.id, set.id)}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Reps</th>
                  <th>Weight</th>
                </tr>
              </thead>
              <tbody>
                {exercise.set_entries.map((set) => (
                  <tr key={set.id}>
                    <td>{set.reps}</td>
                    <td>{set.weight} lbs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {editMode && (
            <button onClick={() => handleAddSet(exercise.id)}>
              Add New Set
            </button>
          )}
        </div>
      ))}
      {editMode ? (
        <div>
          <button onClick={handleSaveChanges}>Save Changes</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
          <button onClick={handleDeleteWorkout}>Delete Workout</button>
        </div>
      ) : (
        <button onClick={() => setEditMode(true)}>Edit Workout</button>
      )}
      <button onClick={onBack}>Back to Calendar</button>
    </div>
  );
};

export default WorkoutDetails;

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from '../styles/WorkoutDetails.module.css'

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
    const updatedWorkout = { ...workoutData };
    const exercise = updatedWorkout.workout_exercises.find(
      (ex) => ex.id === exerciseId
    );
    exercise.set_entries.push({ reps: 0, weight: 0, set_number: exercise.set_entries.length + 1 }); // Temporary ID for new set
    setWorkoutData(updatedWorkout);
  };

// Function to handle deleting a set
const handleDeleteSet = (exerciseId, setId) => {
  if (!workoutData) return; // Ensure data exists

  // Create a deep copy of workoutData
  const updatedWorkout = {
    ...workoutData,
    workout_exercises: workoutData.workout_exercises.map((exercise) => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          set_entries: exercise.set_entries.map((set) => {
            if (set.id === setId) {
              return { ...set, _destroy: true }; // Mark for deletion
            }
            return set;
          }),
        };
      }
      return exercise;
    }),
  };
  //preserve the workout's date upon set deletion
  updatedWorkout.date = workoutData.date;
  setWorkoutData(updatedWorkout);
};

  

  // Function to handle input changes for reps and weight
  const handleInputChange = (exerciseId, setId, field, value) => {
    if (!workoutData) return; // Ensure data exists
    const updatedWorkout = { ...workoutData };
    const exercise = updatedWorkout.workout_exercises.find(
      (ex) => ex.id === exerciseId
    );
    const set = exercise.set_entries.find((set) => set.id === setId);
    set[field] = value; // Update the specific field (reps or weight)
    setWorkoutData(updatedWorkout);
  };

  // Function to save changes to the backend
  const handleSaveChanges = () => {
    if (!workoutData) return; // Ensure data exists

     // Prepare the payload
  const payload = {
    workout: {
      date: workoutData.date, // Ensure other top-level fields are included
      workout_exercises_attributes: workoutData.workout_exercises.map((exercise) => ({
        id: exercise.id, // Include the exercise ID
        exercise_id: exercise.exercise.id, // Include linked exercise ID
        set_entries_attributes: exercise.set_entries.map((set) => ({
          id: set.id ? set.id : null, // Include set ID if it exists, null for new
          set_number: set.set_number, // Ensure set_number is included
          reps: set.reps, // Ensure reps are included
          weight: set.weight, // Ensure weight is included
          _destroy: set._destroy
        })),
      })),
    },
  };


    axios
      .put(
        `${process.env.REACT_APP_API_URL}/users/${localStorage.userId}/workouts/${workoutData.id}`,
        payload
      )
      .then(() => {
        setEditMode(false); // Exit edit mode on successful save
      })
      .catch((error) => {
        console.error("Error saving workout:", error);
        setErrors("Failed to save changes. Please try again.");
      });
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
          onBack(workoutData.date, true); //signal a full workout deletion
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



  // Function to handle rendering workout exercises for the UI
const renderWorkoutExercises = () => {
  if (!workoutData) return null;

  // Return a version of workoutData with sets marked `_destroy: true` excluded from display
  return workoutData.workout_exercises.map((exercise) => ({
    ...exercise,
    set_entries: exercise.set_entries.filter((set) => set._destroy !== true), // Filter only for display
  }));
};

const workoutExercisesForUI = renderWorkoutExercises();

const workoutDate = new Date(workoutData.date);

return (
  <div className={styles.container}>
    <button className={styles.backButton} onClick={() => onBack(workoutData.date, false)}>
      Back to Calendar
    </button>
      <h2 className={styles.header}>Workout Details</h2>
      <div className={styles.dateNotesContainer}>
        <p>
          <strong>Date:</strong>{" "}
          {workoutDate
            ? workoutDate.toLocaleDateString("en-US")
            : "Unknown"}
          <br />
          <strong>Notes:</strong> {workoutData.notes}
        </p>
      </div>
      <div className={styles.scrollableContent}>
      {workoutExercisesForUI.map((exercise) => (
        <div key={exercise.id} className={styles.exerciseContainer}>
          <h4>{exercise.exercise.name}</h4>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Reps</th>
                <th>Weight</th>
                {editMode && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {exercise.set_entries.map((set) => (
                <tr key={set.id}>
                  {editMode ? (
                    <>
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
                          className={styles.input}
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
                          className={styles.input}
                        />
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteSet(exercise.id, set.id)}
                          className={styles.button}
                        >
                          X
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{set.reps}</td>
                      <td>{set.weight} lbs</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {editMode && (
            <button
              onClick={() => handleAddSet(exercise.id)}
              className={styles.button}
            >
              Add New Set
            </button>
          )}
        </div>
      ))}
  </div>

      <div className={styles.editButtonContainer}>
        {editMode ? (
          <div className={styles.editModeButtons}>
            <button onClick={handleSaveChanges} className={styles.editModeButton}>
              Save Changes
            </button>
            <button onClick={() => setEditMode(false)} className={styles.editModeButton}>
              Cancel
            </button>
            <button onClick={handleDeleteWorkout} className={styles.editModeButton}>
              Delete Workout
            </button>
          </div>
        ) : (
          <button onClick={() => setEditMode(true)} className={styles.button}>
            Edit Workout
          </button>
        )}
      </div>
    
  </div>
);
};

export default WorkoutDetails;

import React, { useEffect, useState } from "react";
import axios from "axios";

const EditRoutine = ({onNavigateToLanding, routine}) => { 
  const [routineData, setRoutineData] = useState(null);

  useEffect(() => {
    axios
    .get(`${process.env.REACT_APP_API_URL}/users/${localStorage.userId}/workouts/${routine}`)
      .then((response) => {
        setRoutineData(response.data)
      })
    .catch((error) => {
      console.error("Error fetching routine details:", error);
    })
  }, [routine])


  // Function to save changes to the backend
  const handleSaveChanges = () => {

     // Prepare the payload
  const payload = {
    workout: {
      workout_exercises_attributes: routineData.workout_exercises.map((exercise) => ({
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
        `${process.env.REACT_APP_API_URL}/users/${localStorage.userId}/workouts/${routineData.id}`,
        payload
      )
      .then(() => {
        alert('Routine updated successfully!');
        onNavigateToLanding();
      }
      )
      .catch((error) => {
        console.error("Error saving workout:", error);
      });
  };


  const handleDeleteRoutine = () => {
    if (window.confirm("Are you sure you want to delete this routine? This action cannot be undone.")) {
      axios
        .delete(
          `${process.env.REACT_APP_API_URL}/users/${localStorage.userId}/workouts/${routineData.id}`
        )
        .then(() => {
          alert('Routine deleted successfully!');
          onNavigateToLanding();
        })
        .catch((error) => {
          console.error("Error deleting workout:", error);
        });
    }
  };

  // Function to handle deleting a set
  const handleDeleteSet = (exerciseId, setId) => {
    // Create a deep copy of workoutData
    const updatedRoutine = {
      ...routineData,
      workout_exercises: routineData.workout_exercises.map((exercise) => {
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
    setRoutineData(updatedRoutine);
  };

  // Function to handle adding a new set to a specific exercise
  const handleAddSet = (exerciseId) => {
    const updatedRoutine = { ...routineData };
    const exercise = updatedRoutine.workout_exercises.find(
      (ex) => ex.id === exerciseId
    );
    exercise.set_entries.push({ reps: 0, weight: 0, set_number: exercise.set_entries.length + 1 }); // Temporary ID for new set
    setRoutineData(updatedRoutine);
  };


   // Function to handle input changes for reps and weight
   const handleInputChange = (exerciseId, setId, field, value) => {
    const updatedRoutine = { ...routineData };
    const exercise = updatedRoutine.workout_exercises.find(
      (ex) => ex.id === exerciseId
    );
    const set = exercise.set_entries.find((set) => set.id === setId);
    set[field] = value; // Update the specific field (reps or weight)
    setRoutineData(updatedRoutine);
  };


    // Function to handle rendering workout exercises for the UI
    const renderWorkoutExercises = () => {
      if (!routineData || !routineData.workout_exercises) return []; // Ensure routineData is valid
      return routineData.workout_exercises.map((exercise) => ({
        ...exercise,
        set_entries: exercise.set_entries.filter((set) => set._destroy !== true), // Filter sets for display
      }));
    };

const workoutExercisesForUI = renderWorkoutExercises();

  return(
  <div>
    <h2>Routine Details</h2>
    {routineData ? (
      <p>
        <strong>Notes:</strong> {routineData.notes || "No notes"} 
      </p>
    ) : (
      <p>Loading routine details...</p>
    )}

    <h3>Exercises</h3>
    {workoutExercisesForUI.map((exercise) => (
      <div key={exercise.id}>
        <h4>{exercise.exercise.name}</h4>
          <table>
            <thead>
              <tr>
                <th>Reps</th>
                <th>Weight</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exercise.set_entries.map((set) => (
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
          <button onClick={() => handleAddSet(exercise.id)}>Add New Set</button>
      </div>
    ))}
      <div>
        <button onClick={handleSaveChanges}>Save Changes</button>
        <button onClick={handleDeleteRoutine}>Delete Routine</button>
      </div>
      <button onClick={onNavigateToLanding}>Back to Landing Page</button>

  </div>
  )
}

export default EditRoutine;
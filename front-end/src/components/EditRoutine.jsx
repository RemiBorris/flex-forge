import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";

const EditRoutine = ({onNavigateToLanding, routine}) => { 
  const [routineData, setRoutineData] = useState(null);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [availableExercises, setAvailableExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [isEditingRoutineName, setIsEditingRoutineName] = useState(false);
  const [routineName, setRoutineName] = useState("")
  
  
  const [muscleGroups] = useState([
    "abductors", "abs", "adductors", "biceps", "calves", 
    "cardiovascular system", "delts", "forearms", "glutes", 
    "hamstrings", "lats", "levator scapulae", "pectorals", 
    "quads", "serratus anterior", "spine", "traps", "triceps", 
    "upper back"
  ]);

  useEffect(() => {
    if (selectedMuscleGroup) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/exercises?muscle_group=${selectedMuscleGroup}`)
        .then((response) => setAvailableExercises(response.data))
        .catch((error) => console.error("Error fetching exercises:", error));
    }
  }, [selectedMuscleGroup]);

  
  useEffect(() => {
    axios
    .get(`${process.env.REACT_APP_API_URL}/users/${localStorage.userId}/workouts/${routine}`)
      .then((response) => {
        setRoutineData(response.data)
        setNotes(response.data.notes || "")
        setRoutineName(response.data.routine_name || "")
      })
    .catch((error) => {
      console.error("Error fetching routine details:", error);
    })
  }, [routine])


  const handleAddExercise = () => {
    if (!selectedExercise) {
      alert('Please select an exercise to add.');
      return;
    }
  
    const newExercise = {
      id: null, // New exercise won't have an ID yet
      exercise: selectedExercise,
      set_entries: [] // Initially no sets for the new exercise
    };
  
    setRoutineData((prev) => ({
      ...prev,
      workout_exercises: [...prev.workout_exercises, newExercise]
    }));
  
    setSelectedExercise(null); // Reset selected exercise
  };


  const handleDeleteExercise = (exerciseId) => {
    const updatedRoutine = {
      ...routineData,
      workout_exercises: routineData.workout_exercises.map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, _destroy: true }
          : exercise
      ),
    };
  
    setRoutineData(updatedRoutine);
  };


  // Function to save changes to the backend
  const handleSaveChanges = () => {

     // Prepare the payload
  const payload = {
    workout: {
      notes,
      routine_name: routineName,
      workout_exercises_attributes: routineData.workout_exercises.map((exercise) => ({
        id: exercise.id, // Include the exercise ID
        exercise_id: exercise.exercise.id, // Include linked exercise ID
        _destroy: exercise._destroy || false,
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
  const handleDeleteSet = (exerciseId, setKey) => {
    const updatedRoutine = {
      ...routineData,
      workout_exercises: routineData.workout_exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            set_entries: exercise.set_entries.map((set) => {
              if (set.id === setKey || set.tempKey === setKey) {
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
    exercise.set_entries.push({
      id: null, // Use null instead of a temporary ID
      reps: 0,
      weight: 0,
      set_number: exercise.set_entries.length + 1, // Increment set number
      tempKey: `temp-${Date.now()}`, // Assign a unique key
    });
  
    setRoutineData(updatedRoutine);
  };


   // Function to handle input changes for reps and weight
   const handleInputChange = (exerciseId, setKey, field, value) => {
    const updatedRoutine = { ...routineData };
    const exercise = updatedRoutine.workout_exercises.find(
      (ex) => ex.id === exerciseId
    );
    const set = exercise.set_entries.find((set) => set.id === setKey || set.tempKey === setKey);
    set[field] = value;
    setRoutineData(updatedRoutine);
  };


    // Function to handle rendering workout exercises for the UI
    const renderWorkoutExercises = () => {
      if (!routineData || !routineData.workout_exercises) return [];
      return routineData.workout_exercises.filter(
        (exercise) => exercise._destroy !== true
      ).map((exercise) => ({
        ...exercise,
        set_entries: exercise.set_entries.filter((set) => set._destroy !== true)
      }));
    };

    const workoutExercisesForUI = renderWorkoutExercises();

    const handleRoutineNameChange = (event) => {
      setRoutineName(event.target.value);
    };

  return (
    <div>
      <h2>Routine Details</h2>
      {routineData ? (
        <div>
          <h3>
            Routine Name{" "}
            <FaEdit 
            onClick={() => setIsEditingRoutineName(!isEditingRoutineName)}
            />
          </h3>
          {isEditingRoutineName ? (
            <input
              type="text"
              value={routineName}
              onChange={handleRoutineNameChange}
            />
          ) : (
            <h3>{routineName || ""}</h3>
          )}
          <h4>
            Notes{" "}
            <FaEdit
            onClick={() => setIsEditingNotes(!isEditingNotes)}
            />
          </h4>
          {isEditingNotes ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              style={{ width: "100%" }}
            />
          ) : (
            <p>{notes || "No notes"}</p>
          )}
        </div>
      ) : (
        <p>Loading routine details...</p>
      )}

      <h3>Exercises</h3>
      {workoutExercisesForUI.map((exercise) => (
        <div key={exercise.id}>
          <h4>{exercise.exercise.name}</h4>
          <button onClick={() => handleDeleteExercise(exercise.id)}>Delete</button>
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
                <tr key={set.id || set.tempKey}>
                  <td>
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) =>
                        handleInputChange(
                          exercise.id,
                          set.id || set.tempKey,
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
                          set.id || set.tempKey,
                          "weight",
                          parseInt(e.target.value, 10)
                        )
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => handleDeleteSet(exercise.id, set.id || set.tempKey)}>
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
        {/* Button to toggle visibility of the "Add Exercise" section */}
        <button onClick={() => setShowAddExercise(!showAddExercise)}>
          {showAddExercise ? "Cancel Add Exercise" : "Add Exercise"}
        </button>

        {/* Conditionally render the "Add Exercise" section */}
        {showAddExercise && (
          <div>
            <h3>Add Exercise</h3>
            <label>
              Select Muscle Group:
              <select
                value={selectedMuscleGroup}
                onChange={(e) => setSelectedMuscleGroup(e.target.value)}
              >
                <option value="">-- Select --</option>
                {muscleGroups.map((group, index) => (
                  <option key={index} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </label>

            {selectedMuscleGroup && (
              <label>
                Select Exercise:
                <select
                  value={selectedExercise ? selectedExercise.id : ''}
                  onChange={(e) => {
                    const exercise = availableExercises.find(
                      (ex) => ex.id === parseInt(e.target.value, 10)
                    );
                    setSelectedExercise(exercise);
                  }}
                >
                  <option value="">-- Select --</option>
                  {availableExercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <button onClick={handleAddExercise}>Add Exercise</button>
          </div>
        )}
      </div>

      <div>
        <button onClick={handleSaveChanges}>Save Changes</button>
        <button onClick={handleDeleteRoutine}>Delete Routine</button>
      </div>
      <button onClick={onNavigateToLanding}>Back to Landing Page</button>
    </div>
  );
};

export default EditRoutine;
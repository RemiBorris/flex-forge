import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewRoutine = ({onNavigateToLanding}) =>{
  const userId = localStorage.getItem('userId'); //get userId from localStorage
  

    const [routineName, setRoutineName] = useState('');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
    const [availableExercises, setAvailableExercises] = useState([]); // List of exercises based on selected muscle group
    const [selectedExercise, setSelectedExercise] = useState(null); // The exercise selected by the user
    const [sets, setSets] = useState(3); // Default sets
    const [reps, setReps] = useState(10); // Default reps
    const [weight, setWeight] = useState(0); // Weight for the exercise
    const [routine, setRoutine] = useState([]); // The list of exercises the user is adding to their routine
  
     // Hardcoded muscle groups
  const muscleGroups = [
    "Abductors", "Abs", "Adductors", "Biceps", "Calves", 
    "Cardiovascular system", "Delts", "Forearms", "Glutes", 
    "Hamstrings", "Lats", "Levator scapulae", "Pectorals", 
    "Quads", "Serratus anterior", "Spine", "Traps", "Triceps", 
    "Upper back"
  ];

   // Fetch exercises when muscle group is selected
   useEffect(() => {
    if (selectedMuscleGroup) {
      console.log('Fetching exercises for:', selectedMuscleGroup);  // Log selected muscle group
      const fetchExercisesForMuscleGroup = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/exercises?muscle_group=${selectedMuscleGroup}`);
          console.log('Fetched exercises:', response.data); // Debugging line
          setAvailableExercises(response.data); // Assuming exercises returns a filtered list of exercises
        } catch (error) {
          console.error('Error fetching exercises:', error);
        }
      };

      fetchExercisesForMuscleGroup();
    }
  }, [selectedMuscleGroup]);

  // Handle adding an exercise to the routine
  const handleAddExercise = () => {
    if (selectedExercise && weight > 0) {
      setRoutine([...routine, { 
        ...selectedExercise, 
        sets, 
        reps, 
        weight 
      }]);
      setSelectedExercise(null);
      setWeight(0); // Reset weight for the next exercise
      setSets(3); // Reset sets
      setReps(10); // Reset reps
    } else {
      alert('Please select an exercise and enter weight.');
    }
  };

  // Handle save routine
  const handleSaveRoutine = async () => {
    const payload = {
      workout: {
        user_id: userId,
        isRoutine: true, // Mark as routine
        routine_name: routineName,
        workout_exercises_attributes: routine.map((exercise) => ({
          exercise_id: exercise.id,
          set_entries_attributes: Array.from({ length: exercise.sets }, (_, index) => ({
            set_number: index + 1, // Example: set_number is sequential
            reps: exercise.reps,
            weight: exercise.weight
          }))
        }))
      }
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/${userId}/workouts/create_routine`, payload);
      console.log(response.data)
      alert('Routine created successfully!');
      onNavigateToLanding();
    } catch (error) {
      console.error('Error creating routine:', error);
      alert('Failed to create routine. Please try again.');
    }
  };

  return (
    <div>
      <button onClick={onNavigateToLanding}>Back to Landing Page</button>

      <h1>Create a New Routine</h1>
      
      <form>
        {/* Routine Name */}
        <label>
          Routine Name:
          <input
            type="text"
            value={routineName}
            onChange={(e) => setRoutineName(e.target.value)}
            required
          />
        </label>


        {/* Muscle Group Dropdown (hardcoded) */}
        <label>
          Select Muscle Group:
          <select
            value={selectedMuscleGroup}
            onChange={(e) => setSelectedMuscleGroup(e.target.value)}
            required
          >
            <option value="">-- Select --</option>
            {muscleGroups.map((group, index) => (
              <option key={index} value={group}>
                {group}
              </option>
            ))}
          </select>
        </label>

        {/* Exercises Dropdown */}
        {selectedMuscleGroup && (
          <label>
            Select Exercise:
            <select
              value={selectedExercise ? selectedExercise.id : ''}
              onChange={(e) => {
                const exercise = availableExercises.find((ex) => ex.id === parseInt(e.target.value));
                setSelectedExercise(exercise);
              }}
              required
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

        {/* Sets, Reps, and Weight */}
        {selectedExercise && (
          <div>
            <label>
              Sets: 
              <input 
                type="number" 
                value={sets} 
                onChange={(e) => setSets(e.target.value)} 
                min="1"
              />
            </label>
            <label>
              Reps: 
              <input 
                type="number" 
                value={reps} 
                onChange={(e) => setReps(e.target.value)} 
                min="1"
              />
            </label>
            <label>
              Weight (per set): 
              <input 
                type="number" 
                value={weight} 
                onChange={(e) => setWeight(e.target.value)} 
                required
              />
            </label>

            {/* Add Exercise Button */}
            <button type="button" onClick={handleAddExercise}>
              Add Exercise to Routine
            </button>
          </div>
        )}

        {/* Display Added Exercises */}
        <h3>Selected Exercises:</h3>
        {routine.map((exercise, index) => (
          <div key={index}>
            <p>{exercise.name}</p>
            <p>Sets: {exercise.sets}, Reps: {exercise.reps}, Weight: {exercise.weight}</p>
          </div>
        ))}

        {/* Save Routine */}
        <button type="button" onClick={handleSaveRoutine}>Save Routine</button>
      </form>
    </div>
  );
};
  

export default NewRoutine;
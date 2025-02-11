import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/NewRoutine.module.css'


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
    "abductors", "abs", "adductors", "biceps", "calves", 
    "cardiovascular system", "delts", "forearms", "glutes", 
    "hamstrings", "lats", "levator scapulae", "pectorals", 
    "quads", "serratus anterior", "spine", "traps", "triceps", 
    "upper back"
  ];

   // Fetch exercises when muscle group is selected
   useEffect(() => {
    if (selectedMuscleGroup) {
      console.log('Fetching exercises for:', selectedMuscleGroup);  // Log selected muscle group
      const fetchExercisesForMuscleGroup = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/exercises?muscle_group=${selectedMuscleGroup}`);
        
          setAvailableExercises(response.data); // Assuming exercises returns a filtered list of exercises
        } catch (error) {
          console.error('Error fetching exercises:', error);
        }
      };

      fetchExercisesForMuscleGroup();
    }
  }, [selectedMuscleGroup, availableExercises]);
  

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
      (console.log(response.data))
      // alert('Routine created successfully!');
      onNavigateToLanding();
    } catch (error) {
      console.error('Error creating routine:', error);
      alert('Failed to create routine. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={onNavigateToLanding}>
        Back to Landing Page
      </button>
      <div className={styles.scrollableContent}>
        <h1
          className={`${styles.header} ${
            routine.length > 0 ? styles.hidden : ""
          }`}
        >
          Create a New Routine
        </h1>
        <form className={styles.form}>
          <label className={styles.label}>
            Routine Name:
            <input
              type="text"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Select Muscle Group:
            <select
              value={selectedMuscleGroup}
              onChange={(e) => setSelectedMuscleGroup(e.target.value)}
              className={styles.select}
            >
              <option value="">-- Select --</option>
              {muscleGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </label>
          {selectedMuscleGroup && (
            <label className={styles.label}>
              Select Exercise:
              <select
                value={selectedExercise ? selectedExercise.id : ""}
                onChange={(e) =>
                  setSelectedExercise(
                    availableExercises.find(
                      (ex) => ex.id === parseInt(e.target.value)
                    )
                  )
                }
                className={styles.select}
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
          {selectedExercise && (
            <div className={styles.form}>
              <label className={styles.label}>
                Sets:
                <input
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  className={styles.input}
                />
              </label>
              <label className={styles.label}>
                Reps:
                <input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className={styles.input}
                />
              </label>
              <label className={styles.label}>
                Weight:
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className={styles.input}
                />
              </label>
              <button
                type="button"
                onClick={handleAddExercise}
                className={styles.button}
              >
                Add Exercise
              </button>
            </div>
          )}
        </form>
        <div className={styles.exercisesContainer}>
          <div className={styles.exercisesList}>
            {routine.map((exercise, index) => (
              <div key={index} className={styles.exerciseItem}>
                <p>{exercise.name}</p>
                <p>
                  Sets: {exercise.sets}, Reps: {exercise.reps}, Weight:{" "}
                  {exercise.weight}
                </p>
              </div>
            ))}
          </div>
        </div>
        <button className={styles.button} onClick={handleSaveRoutine}>
            Save Routine
          </button>
      </div>
    </div>
  );
            };


  

export default NewRoutine;
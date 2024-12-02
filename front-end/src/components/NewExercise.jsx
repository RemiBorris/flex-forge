import React, { useState } from 'react'
import {getExerciseByName} from '../routes/exercise_api'
import { saveExerciseToDatabase } from '../routes/database_routes';
import styles from '../styles/NewExercise.module.css'


const NewExercise = ({onNavigateToLanding}) => {

  const [query, setQuery] = useState('');
  const [queryResults, setQueryResults] = useState([]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  }

  const handleSearch = async () => {
    const results = await getExerciseByName(query);
    setQueryResults(results);
  }

  const handleExerciseClick = async (exercise) => {
    const confirmSave = window.confirm(
      `Do you want to save the exercise "${exercise.name}"?`
    );
    if (confirmSave) {
      try {
        await saveExerciseToDatabase(exercise);
        alert(`Exercise "${exercise.name}" saved successfully!`);
      } catch (error) {
        console.error('Error saving exercise:', error);
        alert(`Failed to save exercise "${exercise.name}".`);
      }
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={onNavigateToLanding}>
        Back to Landing Page
      </button>
      <h1 className={styles.header}>Add New Exercise</h1>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Exercise Name"
        className={styles.input}
      />
      <button onClick={handleSearch} className={styles.button}>
        Search
      </button>
      <h3 className={styles.header}>Search Results:</h3>
      <div className={styles.listContainer}>
        {queryResults.map((result) => (
          <div
            key={result.id}
            onClick={() => handleExerciseClick(result)}
            className={styles.listItem}
          >
            {result.name}
          </div>
        ))}
      </div>
    </div>
  );
};
  

export default NewExercise;
import React, { useState } from 'react'
import {getExerciseByName} from '../routes/exercise_api'
import { saveExerciseToDatabase } from '../routes/database_routes';


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

  return(
    <div>
      <button onClick={onNavigateToLanding}>Back to Landing Page</button>
      <h1>Add New Exercise</h1>
      <input type='text' value={query} onChange={handleInputChange} placeholder='Exercise Name'></input>
      <button onClick={handleSearch}>Search</button>
      <h3>Search Results:</h3>
      <ul>
        {queryResults.map((result) => (
          <li 
          key={result.id}
          onClick={() => handleExerciseClick(result)}
          style={{cursor: 'pointer'}}
          >
            {result.name}
          </li>
        ))}
      </ul>
    </div>
    
  )
}

export default NewExercise;
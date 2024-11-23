import React, { useState } from 'react'
import {getExerciseByName} from '../routes/exercise_api'

// API body parts: 
/*
0:"back"
1:"cardio"
2:"chest"
3:"lower arms"
4:"lower legs"
5:"neck"
6:"shoulders"
7:"upper arms"
8:"upper legs"
9:"waist"
*/

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

  return(
    <div>
      <button onClick={onNavigateToLanding}>Back to Landing Page</button>
      <h1>Add New Exercise</h1>
      <input type='text' value={query} onChange={handleInputChange} placeholder='Exercise Name'></input>
      <button onClick={handleSearch}>Search</button>
      <h3>Search Results:</h3>
      <ul>
        {queryResults.map((result) => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
    
  )
}

export default NewExercise;
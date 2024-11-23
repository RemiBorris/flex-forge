import React from 'react'

const NewRoutine = ({onNavigateToLanding}) =>{

  return(
    <div>
      <button onClick={onNavigateToLanding}>Back to Landing Page</button>
      <h1>Routine Name</h1>
      <h2>Muscle Group</h2>
      <h2>Exercise</h2>
      <h2>Sets</h2>
      <h2>Weight</h2>
      <h2>reps</h2>
    </div>
  )
}

export default NewRoutine;
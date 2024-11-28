import axios from "axios";

const getExerciseById = async (id) => {
  if (!process.env.REACT_APP_EXERCISE_API_KEY) {
    console.error('Exercise API key is missing. Check your .env file.');
    return { error: true, message: 'API key missing' };
  }

  try {
    const response = await axios({
      method: 'GET',
      url: `https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`,
      headers: {
        'x-rapidapi-key': process.env.REACT_APP_EXERCISE_API_KEY,
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
      },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error in API call:', {
      message: error.message,
      config: error.config,
      response: error.response ? error.response.data : null,
    });
    return { error: true, message: 'Failed to fetch exercise data.' };
  }
};

const getExerciseByName = async (exerciseName) => {
  if (!process.env.REACT_APP_EXERCISE_API_KEY) {
    console.error('Exercise API key is missing. Check your .env file.');
    return { error: true, message: 'API key missing' };
  }

  const searchQuery = exerciseName.toLowerCase();
  try {
    const response = await axios({
      method: 'GET',
      url: `https://exercisedb.p.rapidapi.com/exercises/name/${searchQuery}`,
      headers: {
        'x-rapidapi-key': process.env.REACT_APP_EXERCISE_API_KEY,
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
      },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error in API call:', {
      message: error.message,
      config: error.config,
      response: error.response ? error.response.data : null,
    });
    return { error: true, message: 'Failed to fetch exercise data.' };
  }
};

export { getExerciseById, getExerciseByName };
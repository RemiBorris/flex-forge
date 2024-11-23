import axios from "axios";

const getExerciseById = async (id) => {
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
    console.error('Error in API call:', error);
    return [];
  }
};

const getExerciseByName = async (exerciseName) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `https://exercisedb.p.rapidapi.com/exercises/name/${exerciseName}`,
      headers: {
        'x-rapidapi-key': process.env.REACT_APP_EXERCISE_API_KEY,
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
      },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error in API call:', error);
    return [];
  }
};


export {getExerciseById, getExerciseByName};
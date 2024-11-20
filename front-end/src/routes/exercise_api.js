require('dotenv').config({path:'../../.env'});
const axios = require('axios');

const getExerciseById = async(id) => {
  const options = {
    method: 'GET',
    url: `https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`,
    headers: {
      'x-rapidapi-key': process.env.EXERCISE_API_KEY,
      'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}


const getExerciseByName = async(exerciseName) => {

  const options = {
    method: 'GET',
    url: `https://exercisedb.p.rapidapi.com/exercises/name/${exerciseName}`,
    params: {
      offset: '0',
      limit: '10'
    },
    headers: {
      'x-rapidapi-key': process.env.EXERCISE_API_KEY,
      'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
    }
  };
  
  try {
    const response = await axios.request(options)
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

import axios from "axios";

const saveExerciseToDatabase = async (exercise) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/exercises`, {
      name: exercise.name,
      category: exercise.category,
      description: exercise.instructions,
      muscle_group: exercise.target,
      api_key: exercise.id
    });
    return response.data;
  } catch (error) {
    console.error('Error saving exercise to database:', error);
    throw error;
  }
}

export {saveExerciseToDatabase};
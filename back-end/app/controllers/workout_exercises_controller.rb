class WorkoutExercisesController < ApplicationController
  def create
    workout_exercise = WorkoutExercise.create(workout_exercise_params)
    if workout_exercise.save
      render json: workout_exercise, status: :created
    else
      workout_exercise.errors, satus: :unprocessable_entity
    end
  end


  private

  def workout_exercise_params
    params.require(:workout_exercise).permit(:workout_id, exercise_id)
  end
end

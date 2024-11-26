class ExercisesController < ApplicationController
  def index
    # Check if muscle_group parameter is provided
    if params[:muscle_group].present?
      # Filter exercises by muscle_group
      exercises = Exercise.where(muscle_group: params[:muscle_group])
    else
    exercises = Exercise.all
    end
    render json: exercises
  end

  def show
    exercise = Exercise.find(params[:id])
    render json: exercise
  end

  def create
    #changed from .create to .new to avoid saving exercise before checking if valid
    exercise = Exercise.new(exercise_params)
    if exercise.save
      render json: exercise, status: :created
    else
      render json: :exercise.errors, status: :unprocessable_entity
    end
  end

  def update
    exercise = Exercise.find(params[:id])
    if exercise.update(exercise_params)
      render json: exercise
    else
      render json: exercise.errors, status: :unprocessable_entity
    end
  end

  def destroy
    exercise = Exercise.find(params[:id])
    exercise.destroy
    head :no_content
  end

  private

  def exercise_params
    params.require(:exercise).permit(:name, :muscle_group, :api_key, description: [])
  end
end

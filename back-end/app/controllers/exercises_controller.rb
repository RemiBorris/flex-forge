class ExercisesController < ApplicationController
  before_action :disable_cache

  def index
    # Check if muscle_group parameter is provided
    if params[:muscle_group].present?
      #normalize muscle group to lowercase before querying
      muscle_group = params[:muscle_group].downcase
      # Filter exercises by muscle_group
      exercises = Exercise.where(muscle_group: muscle_group)
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
    #normalize muscle group to lowercase before saving it
    normalized_muscle_group = exercise_params[:muscle_group].downcase
    exercise = Exercise.new(exercise_params.merge(muscle_group: normalized_muscle_group))
    if exercise.save
      render json: exercise, status: :created
    else
      render json: :exercise.errors, status: :unprocessable_entity
    end
  end

  def update
    exercise = Exercise.find(params[:id])
     # Normalize the muscle group to lowercase before updating
     normalized_muscle_group = exercise_params[:muscle_group].downcase
     if exercise.update(exercise_params.merge(muscle_group: normalized_muscle_group))
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

  def disable_cache
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
  end
end

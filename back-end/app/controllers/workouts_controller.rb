class WorkoutsController < ApplicationController

  before_action :set_user
  before_action :set_workout, only: [:show, :update, :destroy] #excludes index

  def index
    workouts = @user.workouts.includes(workout_exercises: :exercise)  # Eager loading to avoid N+1 queries
    render json: workouts.as_json(include: { workout_exercises: { include: :exercise } })
  end

  def show
    render json: @workout.as_json(include: { workout_exercises: { include: :exercise } })
  end

  def create
    workout = Workout.create(workout_params)
    if workout.save
      render json: workout, status: :created
    else
      render json: workout.errors, status: :unprocessable_entity
    end
  end

  def update
    workout = Workout.find(params[:id])
    if workout.update(workout_params)
      render json: workout
    else
      render json: workout.errors, status: :unprocessable_entity
    end
  end

  def destroy 
    workout = Workout.find(params[:id])
    workout.destroy
    head :no_content
  end

  private
  
  def workout_params
    params.require(:workout).permit(:user_id, :date, :notes)
  end

  def set_user
    @user = User.find(params[:user_id])
  end

  def set_workout
    @workout = @user.workouts.find(params[:id])
  end
  
end

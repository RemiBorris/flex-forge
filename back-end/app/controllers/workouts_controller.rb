class WorkoutsController < ApplicationController

  def index
    workouts = Workout.all
    render json: workouts  
  end

  def show
    workout = Workout.find(params[:id])
    render json: workout
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
end

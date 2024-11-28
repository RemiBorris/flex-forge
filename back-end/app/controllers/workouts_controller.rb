class WorkoutsController < ApplicationController

  before_action :set_user
  before_action :set_workout, only: [:show, :update, :destroy] #excludes index

  def index
    workouts = @user.workouts.includes(workout_exercises: [:exercise, :set_entries]) # Include set_entries
    render json: workouts
  end

  def show
    render json: @workout.as_json(include: { 
      workout_exercises: { 
        include: [
          :exercise, 
          :set_entries # Include set_entries in the response for show
        ] 
      } 
    })
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

  def exercise_summary
    user = User.find(params[:user_id])

    summary = WorkoutExercise
              .joins(:exercise, :workout)
              .where(workouts: { user_id: user.id, date: 30.days.ago..Date.today })
              .select(
                "exercises.id AS exercise_id",
                "exercises.name AS exercise_name",
                "workouts.date AS workout_date",
                "AVG(set_entries.weight) AS avg_weight",
                "SUM(set_entries.reps) AS total_reps",
                "workout_exercises.id AS id" # Ensure id is included here
              )
              .joins(:set_entries)
              .group("exercises.id, exercises.name, workouts.date, workout_exercises.id")
              .order("workouts.date ASC")

    render json: summary
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

class WorkoutsController < ApplicationController

  before_action :set_user
  before_action :set_workout, only: [:show, :update, :destroy] #excludes index

  def index
    # Filter workouts to only include scheduled workouts (isRoutine: false)
    scheduled_workouts = @user.workouts
    .where(isRoutine: false)
    .includes(workout_exercises: [:exercise, :set_entries])
    render json: scheduled_workouts
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

  #action for routines (displays form)
  def new_routine
    @workout = Workout.new(isRoutine: true)
  end

   # CREATE action for routines
   def create_routine
    @workout = @user.workouts.new(workout_params)
    @workout.isRoutine = true  # Mark this workout as a routine

    if @workout.save
      # Now, save workout_exercises based on the routine's payload
      workout_params[:workout_exercises_attributes].each do |exercise_params|
        workout_exercise = @workout.workout_exercises.create!(
          exercise_id: exercise_params[:exercise_id]
        )
        # Now create the set_entries for this workout_exercise
      exercise_params[:set_entries_attributes].each do |set_entry_params|
        workout_exercise.set_entries.create!(set_entry_params)
      end
      end
      render json: @workout, status: :created
    else
      render json: @workout.errors, status: :unprocessable_entity
    end
  end

   # NEW action for scheduled workouts
   def new_scheduled_workout
    @workout = Workout.new(isRoutine: false)
  end

   # CREATE action for scheduled workouts
   def create_scheduled_workout
    @workout = @user.workouts.new(workout_params)
    @workout.isRoutine = false  # Mark this workout as a scheduled workout

    if @workout.save
      render json: @workout, status: :created
    else
      render json: @workout.errors, status: :unprocessable_entity
    end
  end

  # UPDATE action - edit an existing workout
  def update
    if @workout.update(workout_params)
      render json: @workout
    else
      render json: @workout.errors, status: :unprocessable_entity
    end
  end

  # action to retrieve ONLY routines (those marked isRoutine: true)
  def routines
    routines = @user.workouts.where(isRoutine: true).includes(workout_exercises: [:exercise, :set_entries]) 
    render json: routines
  end


  def destroy 
    @workout.destroy
    head :no_content
  end

  private
  
  def workout_params
    params.require(:workout).permit(
      :user_id, 
      :isRoutine, 
      :routine_name, 
      workout_exercises_attributes: [
        :exercise_id, 
        set_entries_attributes: [:set_number, :reps, :weight]
      ]
    )
  end


  def set_user
    @user = User.find(params[:user_id])
  end

  def set_workout
    @workout = @user.workouts.find(params[:id])
  end
  
end

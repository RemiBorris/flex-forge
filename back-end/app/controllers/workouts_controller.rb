class WorkoutsController < ApplicationController
  before_action :set_user
  before_action :set_workout, only: [:show, :update, :destroy]

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

  # CREATE action for routines (remains the same)
  def create_routine
    @workout = @user.workouts.new(workout_params)
    @workout.isRoutine = true  # Mark this workout as a routine

    if @workout.save
      render json: @workout.as_json(include: {
        workout_exercises: {
          include: :set_entries
        }
      }), status: :created
    else
      render json: @workout.errors, status: :unprocessable_entity
    end
  end

    # CREATE action for scheduled workouts
    def create_scheduled_workout
      
      # Find the routine based on the provided routine_id
      routine = @user.workouts.find_by(id: params[:routine_id], isRoutine: true)
  
      if routine.nil?
        render json: { error: "Routine not found" }, status: :not_found
        return
      end
  
      # Create a new workout based on the routine's template
      @workout = @user.workouts.new(
        isRoutine: false,
         routine_name: routine.routine_name,
         date: params[:date]
        )
  
      # Copy all workout exercises from the routine to the new workout
      routine.workout_exercises.each do |workout_exercise|
        @workout.workout_exercises.build(
          exercise_id: workout_exercise.exercise_id,
          set_entries_attributes: workout_exercise.set_entries.map do |set_entry|
            {
              set_number: set_entry.set_number,
              reps: set_entry.reps,
              weight: set_entry.weight
            }
          end
        )
      end
  
      if @workout.save
        render json: @workout.as_json(include: { workout_exercises: { include: :set_entries } }), status: :created
      else
        render json: @workout.errors, status: :unprocessable_entity
      end
    end
  

  # UPDATE action - edit an existing workout
  def update
    if @workout.update(workout_params)
      render json: @workout.as_json(include: { 
  workout_exercises: { include: :set_entries } 
})
    else
      render json: @workout.errors, status: :unprocessable_entity
    end
  end

  # Action to retrieve ONLY routines (those marked isRoutine: true)
  def routines
    routines = @user.workouts.where(isRoutine: true).includes(workout_exercises: [:exercise, :set_entries]) 
    render json: routines
  end

  def destroy 
    @workout.destroy
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
    params.require(:workout).permit(
      :user_id, 
      :isRoutine, 
      :routine_name,
      :date,
      workout_exercises_attributes: [
        :id, #include workout_exercise ID
        :exercise_id, 
        :_destroy,
        set_entries_attributes: [ :id, :set_number, :reps, :weight, :_destroy]
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

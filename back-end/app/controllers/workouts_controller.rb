class WorkoutsController < ApplicationController
  before_action :set_user
  before_action :set_workout, only: [:show, :update, :destroy]

  def index
    workouts = @user.workouts.includes(workout_exercises: [:exercise, :set_entries])
    render json: workouts
  end

  def show
    render json: @workout.as_json(include: {
      workout_exercises: {
        include: [
          :exercise,
          :set_entries
        ]
      }
    })
  end

  def create
    workout = @user.workouts.new(workout_params)
    if workout.save
      render json: workout, status: :created
    else
      render json: workout.errors, status: :unprocessable_entity
    end
  end

  def update
    sanitized_params = sanitize_params_for_update
    if @workout.update(sanitized_params)
      render json: @workout.as_json(include: {
        workout_exercises: {
          include: [
            :exercise,
            :set_entries
          ]
        }
      })
    else
      render json: @workout.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @workout.destroy
    head :no_content
  end

  private

  def workout_params
    params.require(:workout).permit(
      :date,
      :notes,
      workout_exercises_attributes: [
        :id,
        :exercise_id,
        :_destroy,
        set_entries_attributes: [
          :id,
          :set_number,
          :reps,
          :weight,
          :_destroy
        ]
      ]
    )
  end

  # Sanitize params by removing unnecessary keys
  def sanitize_params_for_update
    sanitized = workout_params.to_h
    sanitized.delete('id') # Ensure 'id' isn't passed to the top-level workout object
    sanitized.deep_transform_values do |value|
      # Remove nested `created_at`, `updated_at` where unnecessary
      if value.is_a?(Hash)
        value.reject { |k, _| %w[created_at updated_at].include?(k) }
      else
        value
      end
    end
  end

  def set_user
    @user = User.find(params[:user_id])
  end

  def set_workout
    @workout = @user.workouts.find(params[:id])
  end
end

class Workout < ApplicationRecord
  belongs_to :user
  has_many :workout_exercises, dependent: :destroy

  # Enables nested attributes for workout_exercises
  accepts_nested_attributes_for :workout_exercises, allow_destroy: true

  # Scopes from the main branch
  scope :routines, -> { where(isRoutine: true) }
  scope :scheduled_workouts, -> { where(isRoutine: false) }

  # Method to check if a workout is a routine
  def routine?
    isRoutine
  end
end
class Workout < ApplicationRecord
  belongs_to :user
  has_many :workout_exercises, dependent: :destroy

   # Added this line to accept nested attributes for workout_exercises
   accepts_nested_attributes_for :workout_exercises, allow_destroy: true

  scope :routines, -> { where(isRoutine: true) }
  scope :scheduled_workouts, -> { where(isRoutine: false) }

  def routine?
    isRoutine
  end
end

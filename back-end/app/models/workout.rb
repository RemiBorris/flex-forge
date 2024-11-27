class Workout < ApplicationRecord
  belongs_to :user
  has_many :workout_exercises, dependent: :destroy
  accepts_nested_attributes_for :workout_exercises, allow_destroy: true # Enables nested attributes for workout_exercises
end
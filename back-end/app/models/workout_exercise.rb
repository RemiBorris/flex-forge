class WorkoutExercise < ApplicationRecord
  belongs_to :workout
  belongs_to :exercise
  has_many :set_entries, dependent: :destroy
  accepts_nested_attributes_for :set_entries, allow_destroy: true # Enables nested attributes for set_entries
end

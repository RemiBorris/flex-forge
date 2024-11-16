class SetEntry < ApplicationRecord
  belongs_to :workout_exercise
  validates :set_number, :reps, presence: true
end

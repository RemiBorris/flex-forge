class SessionExercise < ApplicationRecord
  belongs_to :workout_session
  belongs_to :exercise

  validates :reps, presence: true, numericality: { greater_than: 0 }
  validates :set_number, presence: true, numericality: {greater_than: 0 }
end

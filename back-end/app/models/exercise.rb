class Exercise < ApplicationRecord
  has_many :workout_exercises
  validates :name, presence: true, uniqueness: true
end

class Exercise < ApplicationRecord
  has_many :workout_exercises
  validates :name, presence: true, uniqueness: true
  validates :api_key, uniqueness: true
end

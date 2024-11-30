class Exercise < ApplicationRecord
  has_many :workout_exercises
  validates :name, presence: true, uniqueness: true
  validates :api_key, uniqueness: true
  validate :description_is_array
  validates :muscle_group, presence: true

  private

  def description_is_array
    errors.add(:description, "must be an array") unless description.is_a?(Array)
  end
end

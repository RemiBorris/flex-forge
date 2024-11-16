class User < ApplicationRecord
  has_many :workouts, dependent: :destroy
  validates :email, presence: true, uniqueness: true
end

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)


require 'faker'

# Clear existing data to prevent duplicates
User.destroy_all
Workout.destroy_all
Exercise.destroy_all
WorkoutExercise.destroy_all
SetEntry.destroy_all

# Create two users
users = [
  User.create!(name: 'Alice Gymfan', email: 'alice@example.com', avatar: 'https://via.placeholder.com/150'),
  User.create!(name: 'Bob Fitguy', email: 'bob@example.com', avatar: 'https://via.placeholder.com/150')
]

# Create some sample exercises
exercise_list = [
  { name: 'Bench Press', category: 'Strength', description: 'Chest exercise', muscle_group: 'Chest' },
  { name: 'Squat', category: 'Strength', description: 'Leg exercise', muscle_group: 'Legs' },
  { name: 'Deadlift', category: 'Strength', description: 'Full body exercise', muscle_group: 'Back' },
  { name: 'Pull-Up', category: 'Strength', description: 'Back exercise', muscle_group: 'Back' },
  { name: 'Shoulder Press', category: 'Strength', description: 'Shoulder exercise', muscle_group: 'Shoulders' },
  { name: 'Bicep Curl', category: 'Strength', description: 'Arm exercise', muscle_group: 'Arms' },
  { name: 'Tricep Dip', category: 'Strength', description: 'Arm exercise', muscle_group: 'Arms' },
  { name: 'Lunge', category: 'Strength', description: 'Leg exercise', muscle_group: 'Legs' },
  { name: 'Plank', category: 'Core', description: 'Core exercise', muscle_group: 'Core' }
]

exercises = exercise_list.map do |exercise|
  Exercise.create!(exercise)
end

# Create workouts for each user over 6 weeks (3-4 times per week)
start_date = 6.weeks.ago.to_date

users.each do |user|
  workout_dates = (0..41).to_a.sample(21).map { |n| start_date + n.days }.sort

  workout_dates.each do |date|
    workout = Workout.create!(user: user, date: date, notes: Faker::Quote.matz)

    # Randomly select 3-5 exercises for each workout
    selected_exercises = exercises.sample(rand(3..5))

    selected_exercises.each do |exercise|
      workout_exercise = WorkoutExercise.create!(workout: workout, exercise: exercise)

      # Create 3-4 sets for each exercise with randomized reps and weight
      (1..rand(3..4)).each do |set_number|
        SetEntry.create!(
          workout_exercise: workout_exercise,
          set_number: set_number,
          reps: rand(6..12),
          weight: rand(20..100)
        )
      end
    end
  end
end

puts "Seed data created successfully!"
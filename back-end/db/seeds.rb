# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)


# Clear existing data to prevent duplicates
User.destroy_all
Workout.destroy_all
Exercise.destroy_all
WorkoutExercise.destroy_all
SetEntry.destroy_all

# Create two users
users = [
  User.create!(name: 'Alice Johnson', email: 'alice@example.com', avatar: 'https://via.placeholder.com/150'),
  User.create!(name: 'Bob Smith', email: 'bob@example.com', avatar: 'https://via.placeholder.com/150')
]

# Create exercises
exercises = [
  Exercise.create!(name: 'Barbell Bench Press', description: 'Chest exercise', muscle_group: 'Pectorals', api_key: "0025"),
  Exercise.create!(name: 'Barbell Full Squat', description: 'Leg exercise', muscle_group: 'Glutes', api_key: "0043"),
  Exercise.create!(name: 'Barbell Deadlift', description: 'Full body exercise', muscle_group: 'Back', api_key: "0032"),
  Exercise.create!(name: 'Pull-Up', description: 'Back exercise', muscle_group: 'Lats', api_key: "0652"),
  Exercise.create!(name: 'Dumbbell One Arm Shoulder Press', description: 'Shoulder exercise', muscle_group: 'Delts', api_key: "0361"),
  Exercise.create!(name: 'Dumbbell Seated Bicep Curl', description: 'Arm exercise', muscle_group: 'Biceps', api_key: "1677"),
  Exercise.create!(name: 'Weighted Tricep Dips', description: 'Arm exercise', muscle_group: 'Triceps', api_key: "1755"),
  Exercise.create!(name: 'Dumbbell Lunge', description: 'Leg exercise', muscle_group: 'Glutes', api_key: "0336"),
  Exercise.create!(name: 'Weighted Front Plank', description: 'Core exercise', muscle_group: 'Abs', api_key: "2135")
]

# Define static workout dates
static_dates = [
  '2024-10-01', '2024-10-04', '2024-10-07', # Week 1
  '2024-10-10', '2024-10-13', '2024-10-16', # Week 2
  '2024-10-19', '2024-10-22', '2024-10-25', # Week 3
  '2024-10-28', '2024-11-01', '2024-11-04', # Week 4
  '2024-11-07', '2024-11-10', '2024-11-13', # Week 5
  '2024-11-16', '2024-11-19', '2024-11-22'  # Week 6
]

# Assign workouts to each user
users.each_with_index do |user, user_index|
  static_dates.each_with_index do |date, workout_index|
    workout = Workout.create!(
      user: user,
      date: Date.parse(date),
      notes: "Workout #{workout_index + 1} for #{user.name}"
    )

    # Add 3 exercises to each workout
    [exercises[0], exercises[1], exercises[2]].each do |exercise|
      workout_exercise = WorkoutExercise.create!(workout: workout, exercise: exercise)

      # Add 3 static sets for each exercise
      3.times do |set_num|
        SetEntry.create!(
          workout_exercise: workout_exercise,
          set_number: set_num + 1,
          reps: 10,
          weight: 50 + (set_num * 5) # Increment weight per set
        )
      end
    end
  end
end

puts "Static seed data with static dates created successfully!"
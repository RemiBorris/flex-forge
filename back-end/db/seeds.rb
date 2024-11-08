# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)



# Create a user
user = User.create!(
  name: "John Doe",
  email: "johndoe@example.com",
  created_at: Time.now,
  updated_at: Time.now
)
# Create a routine for the user
routine = Routine.create!(
  name: "Strength Training",
  user_id: user.id,
  created_at: Time.now,
  updated_at: Time.now
)
# Create some exercises
exercise1 = Exercise.create!(
  name: "Bench Press",
  muscle_group: "Chest",
  created_at: Time.now,
  updated_at: Time.now
)
exercise2 = Exercise.create!(
  name: "Squat",
  muscle_group: "Legs",
  created_at: Time.now,
  updated_at: Time.now
)
exercise3 = Exercise.create!(
  name: "Deadlift",
  muscle_group: "Back",
  created_at: Time.now,
  updated_at: Time.now
)
# Create a workout session for the user
workout_session = WorkoutSession.create!(
  date: Time.now,
  user_id: user.id,
  created_at: Time.now,
  updated_at: Time.now
)
# Add exercises to the workout session through session_exercises
SessionExercise.create!(
  workout_session_id: workout_session.id,
  exercise_id: exercise1.id,
  weight: 80,          # Weight in lbs
  reps: 10,            # Repetitions
  set_number: 1,       # Set number
  created_at: Time.now,
  updated_at: Time.now
)
SessionExercise.create!(
  workout_session_id: workout_session.id,
  exercise_id: exercise1.id,
  weight: 80,
  reps: 8,
  set_number: 2,
  created_at: Time.now,
  updated_at: Time.now
)
SessionExercise.create!(
  workout_session_id: workout_session.id,
  exercise_id: exercise2.id,
  weight: 100,
  reps: 10,
  set_number: 1,
  created_at: Time.now,
  updated_at: Time.now
)
SessionExercise.create!(
  workout_session_id: workout_session.id,
  exercise_id: exercise3.id,
  weight: 120,
  reps: 5,
  set_number: 1,
  created_at: Time.now,
  updated_at: Time.now
)


puts "Seed data successfully!"
class AddReferenceFromWorkoutSessionsToSessionExercises < ActiveRecord::Migration[7.0]
  def change
    add_reference :session_exercises, :session_exercises, null: false, foreign_key: true
  end
end

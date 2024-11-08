class RemoveRoutineReferenceFromWorkoutSession < ActiveRecord::Migration[7.0]
  def change
    remove_reference :workout_sessions, :routine, null: false, foreign_key: true
  end
end

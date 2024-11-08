class RemoveSelfReferenceSessionExercises < ActiveRecord::Migration[7.0]
  def change
    remove_reference :session_exercises, :session_exercises, null: false, foreign_key: true
  end
end

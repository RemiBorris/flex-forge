class AddMissingFieldsToSessionExercises < ActiveRecord::Migration[7.0]
  def change
    add_column :session_exercises, :weight, :integer
    add_column :session_exercises, :reps, :integer
    add_column :session_exercises, :set_number, :integer
  end
end

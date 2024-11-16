class CreateSetEntries < ActiveRecord::Migration[7.0]
  def change
    create_table :set_entries do |t|
      t.references :workout_exercise, null: false, foreign_key: true
      t.integer :set_number
      t.integer :reps
      t.float :weight

      t.timestamps
    end
  end
end

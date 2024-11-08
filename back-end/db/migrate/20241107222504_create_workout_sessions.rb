class CreateWorkoutSessions < ActiveRecord::Migration[7.0]
  def change
    create_table :workout_sessions do |t|
      t.datetime :date
      t.references :user, null: false, foreign_key: true
      t.references :routine, null: false, foreign_key: true

      t.timestamps
    end
  end
end

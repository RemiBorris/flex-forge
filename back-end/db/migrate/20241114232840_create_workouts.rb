class CreateWorkouts < ActiveRecord::Migration[7.0]
  def change
    create_table :workouts do |t|
      t.references :user, null: false, foreign_key: true
      t.datetime :date
      t.text :notes

      t.timestamps
    end
  end
end

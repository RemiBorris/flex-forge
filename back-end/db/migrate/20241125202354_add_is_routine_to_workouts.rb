class AddIsRoutineToWorkouts < ActiveRecord::Migration[7.0]
  def change
    add_column :workouts, :isRoutine, :boolean, default: false, null: false
  end
end

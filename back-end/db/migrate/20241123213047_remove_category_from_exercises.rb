class RemoveCategoryFromExercises < ActiveRecord::Migration[7.0]
  def change
    remove_column :exercises, :category, :string
  end
end

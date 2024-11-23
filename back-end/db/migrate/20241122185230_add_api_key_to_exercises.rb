class AddApiKeyToExercises < ActiveRecord::Migration[7.0]
  def change
    add_column :exercises, :api_key, :string, unique: true
  end
end

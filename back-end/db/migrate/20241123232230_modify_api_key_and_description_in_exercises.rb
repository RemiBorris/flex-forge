class ModifyApiKeyAndDescriptionInExercises < ActiveRecord::Migration[7.0]
  def change
     # Change `api_key` to bigint
     change_column :exercises, :api_key, :bigint, using: 'api_key::bigint'

     # Change `description` to use an array
     change_column :exercises, :description, :text, array: true, default: [], using: "(string_to_array(description, ','))"
  end
end

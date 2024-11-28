Rails.application.routes.draw do
  # Define user and nested workout routes
  resources :users do
    resources :workouts do
      collection do
        get 'exercise_summary' # New route to fetch summarized exercise data
      end
      resources :workout_exercises # Nested resources for workout_exercises
    end
  end

  # Additional resources
  resources :workouts
  resources :exercises
  resources :workout_exercises, only: [:create]
  resources :set_entries, only: [:create, :update]

  # Root route (optional, modify if you have a specific root controller/action)
  # root "home#index"
end

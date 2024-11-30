Rails.application.routes.draw do
  # Define user and nested workout routes
  resources :users do
    resources :workouts do
      collection do
        get 'exercise_summary'  # Fetch summarized exercise data
        get 'routines'          # Fetch routines
      end

      resources :workout_exercises, only: [:create] # Nested resources
    end
  end

  # Custom routes for creating routines and scheduled workouts
  post '/users/:user_id/workouts/create_routine', to: 'workouts#create_routine'
  post '/users/:user_id/workouts/create_scheduled_workout', to: 'workouts#create_scheduled_workout'


  resources :workouts
  resources :exercises
  resources :workout_exercises, only: [:create]
  resources :set_entries, only: [:create, :update]

  # Root route (optional, modify if you have a specific root controller/action)
  # root "home#index"
end

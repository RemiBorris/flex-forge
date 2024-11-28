Rails.application.routes.draw do
  # Custom routes for creating routines and scheduled workouts
  post '/users/:user_id/workouts/create_routine', to: 'workouts#create_routine'
  post '/users/:user_id/workouts/create_scheduled_workout', to: 'workouts#create_scheduled_workout'

  resources :users do
    resources :workouts do
      resources :workout_exercises, only: [:create, :update, :destroy] do
        resources :set_entries, only: [:create, :update, :destroy]
      end
      collection do
        get 'routines' # Add custom route for routines
      end
    end
  end

  resources :workouts, only: [:index, :show, :create, :update, :destroy]
  resources :exercises, only: [:index, :show]
  resources :workout_exercises, only: [:create]
  resources :set_entries, only: [:create, :update]
end

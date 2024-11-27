Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  resources :users do
    resources :workouts do
      resources :workout_exercises
      #add customer route for routines
      collection do
        get 'routines'
      end
    end
  end

  # Custom routes for creating routines and scheduled workouts
  post '/users/:user_id/workouts/create_routine', to: 'workouts#create_routine'
  post '/users/:user_id/workouts/create_scheduled_workout', to: 'workouts#create_scheduled_workout'


  resources :workouts
  resources :exercises
  resources :workout_exercises, only: [:create]
  resources :set_entries, only: [:create, :update]
end

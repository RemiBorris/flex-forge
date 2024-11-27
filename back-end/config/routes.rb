Rails.application.routes.draw do
  resources :users do
    resources :workouts do
      resources :workout_exercises, only: [:create, :update, :destroy] do
        resources :set_entries, only: [:create, :update, :destroy]
      end
    end
  end

  # Remove redundant routes for these resources
  # Keep only where necessary
  resources :workouts, only: [:index, :show, :create, :update, :destroy]
  resources :exercises, only: [:index, :show]
end
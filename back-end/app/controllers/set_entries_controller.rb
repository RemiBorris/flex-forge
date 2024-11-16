class SetEntriesController < ApplicationController
  def create
  end

  def update
    set_entry = SetEntry.find(params[:id])
    if set_entry.save
      render json: set_entry
    else
      render json: set_entry.error, status: :unprocessable_entity
    end
  end


  private
  
  def set_entry_params
    params.require(:set_entry).permit(:workout_exercise_id, :set_number, :reps, :weight)
  end
end

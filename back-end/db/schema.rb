# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2024_11_26_034914) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "exercises", force: :cascade do |t|
    t.string "name"
    t.text "description", default: [], array: true
    t.string "muscle_group"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "api_key"
  end

  create_table "set_entries", force: :cascade do |t|
    t.bigint "workout_exercise_id", null: false
    t.integer "set_number"
    t.integer "reps"
    t.float "weight"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["workout_exercise_id"], name: "index_set_entries_on_workout_exercise_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "avatar"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "workout_exercises", force: :cascade do |t|
    t.bigint "workout_id", null: false
    t.bigint "exercise_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["exercise_id"], name: "index_workout_exercises_on_exercise_id"
    t.index ["workout_id"], name: "index_workout_exercises_on_workout_id"
  end

  create_table "workouts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.datetime "date"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "isRoutine", default: false, null: false
    t.string "routine_name"
    t.index ["user_id"], name: "index_workouts_on_user_id"
  end

  add_foreign_key "set_entries", "workout_exercises"
  add_foreign_key "workout_exercises", "exercises"
  add_foreign_key "workout_exercises", "workouts"
  add_foreign_key "workouts", "users"
end

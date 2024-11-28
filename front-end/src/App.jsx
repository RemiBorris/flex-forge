import Login from "./components/Login";
import WorkoutCalendar from "./components/WorkoutCalendar";
import LandingPage from "./components/LandingPage";
import React, { useState } from "react"; // Import useState
import NewRoutine from "./components/NewRoutine";
import NewExercise from "./components/NewExercise";
import WorkoutDetails from "./components/WorkoutDetails";

function App() {
  const [userId, setUserId] = useState(null); // Manage logged-in state
  const [username, setUsername] = useState(null)
  const [page, setPage] = useState('login'); // Manage navigation
  const [selectedWorkout, setSelectedWorkout] = useState(null); // Selected workout

  const handleLogin = (id) => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername); // Save username for landing page welcome
    setUserId(id); // Save userId
    setPage('landing'); // Navigate to Landing Page
  };

  const handleLogout = () => {
    localStorage.removeItem("userId"); // Remove user ID from localStorage
    localStorage.removeItem("username") //remove user's name from localStorage
    setUserId(null); // Clear user state
    setPage("login"); // Navigate to login page
  };

  const handleNavigateToWorkoutDetails = (workout) => {
    setSelectedWorkout(workout); // Set the selected workout
    setPage('workoutDetails'); // Navigate to WorkoutDetails view
  };


  const navigateToCalendar = () => setPage('calendar');
  const navigateToLanding = () => setPage('landing');
  const navigateToNewRoutine = () => setPage('newRoutine');
  const navigateToNewExercise = () => setPage('newExercise');

  return (
    <div>
      {/* Render components based on the current page */}
      {page === "login" && <Login onLogin={handleLogin} />}
      {page === "landing" && (
        <LandingPage
          username={username}
          userId={userId}
          onNavigateToCalendar={navigateToCalendar} // Navigate to Calendar
          onLogout={handleLogout} // Handle Logout
          onNavigateToNewRoutine={navigateToNewRoutine}
          onNavigateToNewExercise={navigateToNewExercise}
          onNavigateToWorkoutDetails={handleNavigateToWorkoutDetails} // Navigate to WorkoutDetails
        />
      )}
      {page === "calendar" && (
        <WorkoutCalendar
          userId={userId}
          onNavigateToLanding={navigateToLanding} // Go back to Landing Page
        />
      )}
      {page === "newRoutine" && (
        <NewRoutine
        onNavigateToLanding={navigateToLanding}
        />
      )}
      {page === "newExercise" && (
        <NewExercise
        onNavigateToLanding={navigateToLanding}
        />
      )}
      {page === "workoutDetails" && selectedWorkout && (
        <WorkoutDetails
          workouts={selectedWorkout} // Pass the selected workout
          onBack={navigateToCalendar} // Navigate back to calendar
          onNavigateToLanding={navigateToLanding} // Navigate back to landing
        />
      )}
    </div>
  );
}

export default App;

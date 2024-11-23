import Login from "./components/Login";
import WorkoutCalendar from "./components/WorkoutCalendar";
import LandingPage from "./components/LandingPage";
import React, { useState } from "react"; // Import useState
import NewRoutine from "./components/NewRoutine";
import NewExercise from "./components/NewExercise";

function App() {
  const [userId, setUserId] = useState(null); // Manage logged-in state
  const [username, setUsername] = useState(null)
  const [page, setPage] = useState('login'); // Manage navigation

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
    </div>
  );
}

export default App;

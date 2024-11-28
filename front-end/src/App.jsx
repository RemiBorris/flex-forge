import Login from "./components/Login";
import WorkoutCalendar from "./components/WorkoutCalendar";
import LandingPage from "./components/LandingPage";
import React, { useState } from "react"; // Import useState
import NewRoutine from "./components/NewRoutine";
import NewExercise from "./components/NewExercise";
import ProfilePage from "./components/ProfilePage";

function App() {
  const [page, setPage] = useState('login'); // Manage navigation

  const handleLogin = (id) => {
    setPage('landing'); // Navigate to Landing Page
  };

  const handleLogout = () => {
    localStorage.removeItem("userId"); // Remove user ID from localStorage
    localStorage.removeItem("userName"); //remove user's name from localStorage
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userAvatar")
    setPage("login"); // Navigate to login page
  };

  const navigateToCalendar = () => setPage('calendar');
  const navigateToLanding = () => setPage('landing');
  const navigateToNewRoutine = () => setPage('newRoutine');
  const navigateToNewExercise = () => setPage('newExercise');
  const nagivateToProfilePage = () => setPage('profile')

  return (
    <div>
      {/* Render components based on the current page */}
      {page === "login" && <Login onLogin={handleLogin} />}
      {page === "landing" && (
        <LandingPage
          onNavigateToCalendar={navigateToCalendar} // Navigate to Calendar
          onLogout={handleLogout} // Handle Logout
          onNavigateToNewRoutine={navigateToNewRoutine}
          onNavigateToNewExercise={navigateToNewExercise}
          onNavigateToProfile={nagivateToProfilePage}
        />
      )}
      {page === "calendar" && (
        <WorkoutCalendar
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
      {page === "profile" && (
        <ProfilePage
        onNavigateToLanding={navigateToLanding}
        />
      )}
    </div>
  );
}

export default App;

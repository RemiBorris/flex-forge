import Login from "./components/Login";
import WorkoutCalendar from "./components/WorkoutCalendar";
import LandingPage from "./components/LandingPage";
import React, { useState } from "react"; // Import useState

function App() {
  const [userId, setUserId] = useState(null); // Manage logged-in state
  const [page, setPage] = useState('login'); // Manage navigation

  const handleLogin = (id) => {
    setUserId(id); // Save userId
    setPage('landing'); // Navigate to Landing Page
  };

  const handleLogout = () => {
    localStorage.removeItem("userId"); // Remove user ID from localStorage
    setUserId(null); // Clear user state
    setPage("login"); // Navigate to login page
  };

  const navigateToCalendar = () => setPage('calendar');
  const navigateToLanding = () => setPage('landing');

  return (
    <div>
      {/* Render components based on the current page */}
      {page === "login" && <Login onLogin={handleLogin} />}
      {page === "landing" && (
        <LandingPage
          userId={userId}
          onNavigateToCalendar={navigateToCalendar} // Navigate to Calendar
          onLogout={handleLogout} // Handle Logout
        />
      )}
      {page === "calendar" && (
        <WorkoutCalendar
          userId={userId}
          onNavigateToLanding={navigateToLanding} // Go back to Landing Page
        />
      )}
    </div>
  );
}

export default App;

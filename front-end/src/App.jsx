import Login from "./components/Login";
import WorkoutCalendar from "./components/WorkoutCalendar";
import LandingPage from "./components/LandingPage";
import React, { useState } from "react"; // Import useState
import NewRoutine from "./components/NewRoutine";
import NewExercise from "./components/NewExercise";
import ProfilePage from "./components/ProfilePage";
import WorkoutDetails from "./components/WorkoutDetails";
import EditRoutine from "./components/EditRoutine";

function App() {
  const [page, setPage] = useState("login"); // Manage navigation
  const [selectedWorkout, setSelectedWorkout] = useState(null); // Selected workout
  const [selectedDate, setSelectedDate] = useState(null); // Track the clicked date
  const [selectedEditRoutine, setSelectedEditRoutine] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null); // Track the clicked date

  const handleLogin = (id) => {
    setPage("landing"); // Navigate to Landing Page
  };

  const handleLogout = () => {
    localStorage.removeItem("userId"); // Remove user ID from localStorage
    localStorage.removeItem("userName"); // Remove user's name from localStorage
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userAvatar");
    setPage("login"); // Navigate to login page
  };

  const handleNavigateToWorkoutDetails = (workout) => {
    setSelectedWorkout(workout); // Set the selected workout
    setPage("workoutDetails"); // Navigate to WorkoutDetails view
  };

  const navigateToCalendar = () => setPage("calendar");
  const navigateToLanding = () => setPage("landing");
  const navigateToNewRoutine = () => setPage("newRoutine");
  const navigateToNewExercise = () => setPage("newExercise");
  const nagivateToProfilePage = () => setPage("profile");

  const nagivateToEditRoutine = (routineID) => {
    setSelectedEditRoutine(routineID)
    setPage('editRoutine')
  };

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
          onNavigateToWorkoutDetails={handleNavigateToWorkoutDetails} // Navigate to WorkoutDetails
          onNavigateToProfilePage={nagivateToProfilePage}
          selectedDate={selectedDate ? new Date(selectedDate) : null} // Ensure selectedDate is always a Date object
          setSelectedDate={setSelectedDate} // Update the date
          onNavigateToEditRoutine={nagivateToEditRoutine}
          selectedDate={selectedDate ? new Date(selectedDate) : null} // Ensure selectedDate is always a Date object
          setSelectedDate={setSelectedDate} // Update the date
        />
      )}
      {page === "calendar" && (
        <WorkoutCalendar
          onNavigateToLanding={(date) => {
            setSelectedDate(date); // Set the clicked date
            navigateToLanding();
          }}
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
      {page === "workoutDetails" && selectedWorkout && (
        <WorkoutDetails
          workouts={selectedWorkout} // Pass the selected workout
          onBack={navigateToCalendar} // Navigate back to calendar
          onNavigateToLanding={navigateToLanding} // Navigate back to landing
        />
      )}
      {page === "editRoutine" && selectedEditRoutine &&(
        <EditRoutine
        routine={selectedEditRoutine}
        onNavigateToLanding={navigateToLanding}
        />
      )}
    </div>
  );
}

export default App;
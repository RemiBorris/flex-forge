import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa"; // Importing edit icon for consistency
import { RxAvatar } from "react-icons/rx"; // Importing the default avatar icon
import avatars from "../images/avatars";
import axios from "axios"; // For API requests
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement);

const ProfilePage = ({ onNavigateToLanding }) => {
  // Profile state
  const initialAvatar = localStorage.getItem("userAvatar") || ""; // Default to empty if no avatar is set
  const initialName = localStorage.getItem("userName") || "Default Name"; // Default to "Default Name"

  const [avatar, setAvatar] = useState({ url: initialAvatar }); // Initialize avatar with URL object
  const [name, setName] = useState(initialName); // Initialize name from localStorage
  const [isEditingName, setIsEditingName] = useState(false); // State to toggle name edit mode
  const [isEditingAvatar, setIsEditingAvatar] = useState(false); // State to toggle avatar selection
  const [originalData, setOriginalData] = useState({
    name: initialName,
    avatar: initialAvatar,
  }); // Track original data for comparison

  const [exerciseData, setExerciseData] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState({});
  const [chartData, setChartData] = useState(null);

  // Fetch exercise data
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/${localStorage.userId}/workouts/exercise_summary`)
      .then((response) => {
        const data = response.data;

        // Initialize selectedExercises with all exercises set to true
        const initialSelectedExercises = {};
        data.forEach((entry) => {
          initialSelectedExercises[entry.exercise_id] = true;
        });

        setExerciseData(data);
        setSelectedExercises(initialSelectedExercises);
      })
      .catch((error) => console.error("Error fetching exercise data:", error));
  }, []);

  // Format data for the chart
  useEffect(() => {
    if (exerciseData.length > 0) {
      const groupedData = {};

      // Group data by exercise_id
      exerciseData.forEach((entry) => {
        if (!groupedData[entry.exercise_id]) {
          groupedData[entry.exercise_id] = {
            name: entry.exercise_name,
            dates: [],
            avgWeights: [],
          };
        }

        groupedData[entry.exercise_id].dates.push(entry.workout_date.split("T")[0]); // Format date
        groupedData[entry.exercise_id].avgWeights.push(entry.avg_weight);
      });

      // Generate datasets for the chart
      const datasets = Object.keys(groupedData)
        .filter((exerciseId) => selectedExercises[exerciseId]) // Only include selected exercises
        .map((exerciseId, index) => {
          const { name, dates, avgWeights } = groupedData[exerciseId];

          return {
            label: name,
            data: avgWeights,
            borderColor: `hsl(${index * 50}, 70%, 50%)`, // Unique color for each exercise
            backgroundColor: `hsl(${index * 50}, 70%, 70%)`,
            tension: 0.3, // Smooth curves
            fill: false,
          };
        });

      setChartData({
        labels: groupedData[Object.keys(groupedData)[0]].dates, // Use dates from any exercise
        datasets,
      });
    }
  }, [exerciseData, selectedExercises]);

  const handleToggleExercise = (exerciseId) => {
    setSelectedExercises((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const toggleNameEditMode = () => {
    setIsEditingName((prev) => !prev);
  };

  const handleSaveName = () => {
    toggleNameEditMode();
  };

  const toggleAvatarEditMode = () => {
    setIsEditingAvatar((prev) => !prev);
  };

  const selectAvatar = (selectedAvatar) => {
    setAvatar(selectedAvatar);
    setIsEditingAvatar(false);
  };

  const handleSave = () => {
    if (name !== originalData.name || avatar.url !== originalData.avatar) {
      axios
        .patch(`${process.env.REACT_APP_API_URL}/users/${localStorage.userId}`, { name, avatar: avatar.url })
        .then(() => {
          localStorage.setItem("userName", name);
          localStorage.setItem("userAvatar", avatar.url);
          setOriginalData({ name, avatar: avatar.url });
          onNavigateToLanding();
        })
        .catch((error) => {
          console.error("Error updating user:", error.response.data);
        });
    } else {
      onNavigateToLanding();
    }
  };

  return (
    <div>
      <button onClick={handleSave}>Back to Landing Page</button>

      {/* Profile Section */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {/* Avatar Section */}
        <div>
          {avatar.url ? (
            <img
              src={avatar.url}
              alt="Profile Avatar"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                cursor: "pointer",
                marginBottom: "10px",
              }}
              onClick={toggleAvatarEditMode}
            />
          ) : (
            <RxAvatar
              style={{
                width: "100px",
                height: "100px",
                cursor: "pointer",
                marginBottom: "10px",
                color: "#555",
              }}
              onClick={toggleAvatarEditMode}
            />
          )}
          <FaEdit
            onClick={toggleAvatarEditMode}
            style={{ marginLeft: "5px", cursor: "pointer", color: "#555" }}
            title="Change Avatar"
          />
        </div>

        {/* Avatar Selection */}
        {isEditingAvatar && (
          <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", gap: "10px" }}>
            {avatars.map((avatarOption) => (
              <img
                key={avatarOption.id}
                src={avatarOption.url}
                alt={`Avatar ${avatarOption.id}`}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  border: avatar.url === avatarOption.url ? "2px solid #007bff" : "2px solid transparent",
                }}
                onClick={() => selectAvatar(avatarOption)}
              />
            ))}
          </div>
        )}

        {/* Name Section */}
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {isEditingName ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                style={{ marginRight: "10px" }}
              />
              <button onClick={handleSaveName}>Save</button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center" }}>
              <h1 style={{ margin: "0 10px 0 0" }}>{name}</h1>
              <FaEdit
                onClick={toggleNameEditMode}
                style={{ cursor: "pointer", color: "#555" }}
                title="Edit Name"
              />
            </div>
          )}
        </div>
      </div>

      {/* Exercise Summary Section */}
      <div style={{ marginTop: "40px" }}>
        <h1>Exercise Summary (Last 30 Days)</h1>
        <div>
          <h3>Toggle Exercises:</h3>
          {Object.entries(selectedExercises).map(([exerciseId, isSelected]) => {
            const exerciseName = exerciseData.find((entry) => entry.exercise_id === parseInt(exerciseId))?.exercise_name;
            return (
              <label key={exerciseId} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggleExercise(exerciseId)}
                />
                {exerciseName}
              </label>
            );
          })}
        </div>
        {chartData ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Average Weight Over Time by Exercise",
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Date",
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Average Weight (lbs)",
                  },
                  beginAtZero: true,
                },
              },
            }}
          />
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

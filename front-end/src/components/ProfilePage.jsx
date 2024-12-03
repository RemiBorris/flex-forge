import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa"; // Importing edit icon for consistency
import { RxAvatar } from "react-icons/rx"; // Importing the default avatar icon
import avatars from "../images/avatars";
import axios from "axios"; // For API requests
import styles from '../styles/ProfilePage.module.css'
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
import autocolors from "chartjs-plugin-autocolors";

// Register Chart.js components
ChartJS.register(LineElement, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, autocolors);

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
  const [chartData, setChartData] = useState(null);
  const [areAllVisible, setAreAllVisible] = useState(true);

  // Fetch exercise data
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/${localStorage.userId}/workouts/exercise_summary`)
      .then((response) => {
        const data = response.data;
        setExerciseData(data);
      })
      .catch((error) => console.error("Error fetching exercise data:", error));
  }, []);

  // Format data for the chart
  useEffect(() => {
    if (exerciseData.length > 0) {
      const groupedData = {};
      const allDates = new Set();
  
      // Group data by exercise_id and collect all dates
      exerciseData.forEach((entry) => {
        if (!groupedData[entry.exercise_id]) {
          groupedData[entry.exercise_id] = {
            name: entry.exercise_name,
            data: {}, // Use an object to map dates to avg_weights
          };
        }
  
        const date = entry.workout_date.split("T")[0]; // Format date
        allDates.add(date);
  
        groupedData[entry.exercise_id].data[date] = entry.avg_weight;
      });
  
      // Sort all dates
      const sortedDates = Array.from(allDates).sort();
  
      // Generate datasets for the chart
      const datasets = Object.keys(groupedData).map((exerciseId) => {
        const { name, data } = groupedData[exerciseId];
  
        // Fill in missing dates with null
        const exerciseDataPoints = sortedDates.map((date) => data[date] || null);
  
        return {
          label: name,
          data: exerciseDataPoints,
          tension: 0.3, // Smooth curves
          fill: false,
          hidden: true,
          spanGaps: true, 
        };
      });
  
      setChartData({
        labels: sortedDates, // Use all sorted dates as labels
        datasets,
      });
    }
  }, [exerciseData, areAllVisible]);


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

  const toggleAllVisibility = () => {
    setAreAllVisible((prevState) => !prevState);
  };

  return (
    <div>
      <button className={styles.button} onClick={handleSave}>Back to Landing Page</button>

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
              <button className={styles.button} onClick={handleSaveName}>Save</button>
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
      <div className={styles.chartContainer}>
        <h1>Exercise Summary (Last 30 Days)</h1>
        {chartData ? (
          <div>
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  autocolors: {
                    mode: 'dataset'
                  },
                  legend: {
                    position: "right",
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
            
          </div>
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

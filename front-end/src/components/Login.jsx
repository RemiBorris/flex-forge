import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

/*
use useState to manage username input. When a user types into the input, the
username value updates
*/
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/users`)
    .then(response => {
      // Search for a user with a matching name
      const user = response.data.find(user => user.name === username);
      if (user) {
        // Save the user's ID in localStorage
        localStorage.setItem('userId', user.id);
        //on login, navigate to landing page
        onLogin(user.id)
        alert(`Welcome, ${user.name}! Your User ID is: ${user.id}`);
      } else {
        // No matching user found
        alert('Invalid username!');
      }
    })
    .catch(() => alert('Error connecting to the server.'));
  };

  return (
    <div className="main-container">
      <header>
        <h1>Flex Forge</h1>
      </header>
      <div className="login-form">
        <input
          className="input-field"
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input className="input-field" placeholder="Enter Password" />
        <button className="login-btn" onClick={handleLogin}>Login</button>
        
      </div>
    </div>
  );
};

export default Login;


  //handling logout feature when we implement this elsewhere
  /*const handleLogout = () => {
    localStorage.removeItem('userId');
    alert('user logged out');
  }*/

  //<button className="logout-btn" onClick={handleLogout}>Logout</button>

 
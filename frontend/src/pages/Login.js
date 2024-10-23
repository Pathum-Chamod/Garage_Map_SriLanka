import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form refresh

    try {
      // Send POST request to backend
      const response = await axios.post('http://localhost:5001/api/login', {
        username,
        password,
      });

      // If login is successful, store the JWT token in localStorage
      localStorage.setItem('token', response.data.token);

      // Clear any existing error messages
      setError('');

      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (err) {
      // Log detailed error to the console
      console.error('Login Error:', err.response ? err.response.data : err.message);

      // Set error message based on server response
      if (err.response && err.response.status === 401) {
        setError('Invalid username or password');
      } else if (err.response && err.response.status === 429) {
        setError('Too many login attempts. Please try again later.');
      } else {
        setError('An error occurred during login. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required 
          className="login-input"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
          className="login-input"
        />
        <button type="submit" className="login-button">Login</button>
      </form>
      {error && <p className="login-error">{error}</p>}
    </div>
  );
}

export default Login;

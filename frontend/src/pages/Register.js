import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import the CSS file

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form refresh

    try {
      // Send POST request to backend for registration
      await axios.post('http://localhost:5001/api/register', {
        username,
        password,
      });

      // If registration is successful, clear the form and show success message
      setUsername('');
      setPassword('');
      setSuccess('User registered successfully! You can now log in.');
      setError('');

      // Redirect to login page after registration
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Wait for 2 seconds before redirecting
    } catch (error) {
      // Set error message if registration fails
      setError(error.response?.data || 'Registration failed');
      setSuccess('');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required 
          className="register-input"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
          className="register-input"
        />
        <button type="submit" className="register-button">Register</button>
      </form>
      {success && <p className="register-success">{success}</p>}
      {error && <p className="register-error">{error}</p>}
    </div>
  );
}

export default Register;

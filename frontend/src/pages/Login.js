import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (error) {
      // Set error message if login fails
      setError('Invalid username or password');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;

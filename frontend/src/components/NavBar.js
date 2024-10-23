import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from local storage
    window.location.href = '/login'; // Redirect to login
  };

  return (
    <nav>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
}

export default NavBar;

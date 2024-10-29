import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import the AuthContext
import './NavBar.css'; // Assuming you have a separate CSS file for NavBar

function NavBar() {
  const navigate = useNavigate();
  const { isLoggedIn, handleLogout } = useContext(AuthContext); // Access login state and logout handler from context

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">Dashboard</h1>

        {/* Authentication Buttons */}
        <div className="auth-buttons">
          {isLoggedIn ? (
            <button className="logout-button" onClick={() => { handleLogout(); navigate('/'); }}>
              Logout
            </button>
          ) : (
            <button className="login-button" onClick={() => navigate('/login')}>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

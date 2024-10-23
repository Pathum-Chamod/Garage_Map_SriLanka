import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Dashboard.css'; // Import the CSS file

function Dashboard() {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchGarages = async () => {
      try {
        const token = localStorage.getItem('token');
        setLoading(true); // Set loading to true before fetching data

        const response = await axios.get('http://localhost:5001/api/garages', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setGarages(response.data); // Set the garages data from the response
      } catch (error) {
        console.error('Error fetching garages', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchGarages(); // Fetch the garages when the component mounts
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
      <p className="dashboard-subtitle">Here are the garages:</p>
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <ul className="garage-list">
          {garages.map((garage) => (
            <li key={garage._id} className="garage-item">
              <strong>{garage.name}</strong> - {garage.city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;

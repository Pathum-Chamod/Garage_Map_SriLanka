import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [garages, setGarages] = useState([]);

  useEffect(() => {
    const fetchGarages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/garages', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGarages(response.data); // Set the garages data from the response
      } catch (error) {
        console.error('Error fetching garages', error);
      }
    };

    fetchGarages(); // Fetch the garages when the component mounts
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Here are the garages:</p>
      <ul>
        {garages.map(garage => (
          <li key={garage._id}>
            {garage.name} - {garage.city}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;

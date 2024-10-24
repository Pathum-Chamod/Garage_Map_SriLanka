import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MapComponent from '../components/MapComponent';
import { districts } from '../districts'; // Import districts list
import { serviceCategories } from '../services'; // Import service categories list
import { vehicleTypes } from '../vehicleTypes'; // Import vehicle types list
import './Dashboard.css';

function Dashboard() {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('All of Sri Lanka'); // Default district filter
  const [selectedService, setSelectedService] = useState('All Services'); // Default service filter
  const [selectedVehicle, setSelectedVehicle] = useState('All Types'); // Default vehicle filter

  // Function to fetch garages from the backend
  useEffect(() => {
    const fetchGarages = async () => {
      try {
        const token = localStorage.getItem('token');
        setLoading(true);

        // Fetch garages with filters
        const response = await axios.get('http://localhost:5001/api/garages', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            district: selectedDistrict !== 'All of Sri Lanka' ? selectedDistrict : undefined,
            service: selectedService !== 'All Services' ? selectedService : undefined,
            vehicle: selectedVehicle !== 'All Types' ? selectedVehicle : undefined,
          },
        });

        setGarages(response.data);
      } catch (error) {
        console.error('Error fetching garages', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGarages();
  }, [selectedDistrict, selectedService, selectedVehicle]); // Re-fetch data when any filter changes

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      {/* Location Filter */}
      <div className="filter-container">
        <label htmlFor="district-select">Filter by District:</label>
        <select
          id="district-select"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="filter-dropdown"
        >
          {districts.map((district) => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>
      </div>

      {/* Service Category Filter */}
      <div className="filter-container">
        <label htmlFor="service-select">Filter by Service Category:</label>
        <select
          id="service-select"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="filter-dropdown"
        >
          {serviceCategories.map((service) => (
            <option key={service} value={service}>{service}</option>
          ))}
        </select>
      </div>

      {/* Vehicle Type Filter */}
      <div className="filter-container">
        <label htmlFor="vehicle-select">Filter by Vehicle Type:</label>
        <select
          id="vehicle-select"
          value={selectedVehicle}
          onChange={(e) => setSelectedVehicle(e.target.value)}
          className="filter-dropdown"
        >
          {vehicleTypes.map((vehicle) => (
            <option key={vehicle} value={vehicle}>{vehicle}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <MapComponent garages={garages} />
        </div>
      )}
    </div>
  );
}

export default Dashboard;

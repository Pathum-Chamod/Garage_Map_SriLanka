import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import MapComponent from '../components/MapComponent';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import { districts } from '../districts';
import { serviceCategories } from '../services';
import { vehicleTypes } from '../vehicleTypes';
import './Dashboard.css';

function Dashboard() {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All of Sri Lanka');
  const [selectedService, setSelectedService] = useState('All Services');
  const [selectedVehicle, setSelectedVehicle] = useState('All Types');
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [locateUser, setLocateUser] = useState(false);
  const [selectedGarage, setSelectedGarage] = useState(null);

  // Access auth context if available
  const { token } = useContext(AuthContext);

  // Use useCallback to memoize the fetchGarages function
  const fetchGarages = useCallback(async () => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors

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
      setError('Failed to fetch garages. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [selectedDistrict, selectedService, selectedVehicle, token]);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchGarages(); // Fetch data when dependencies change
  }, [fetchGarages]); // Include fetchGarages in the dependency array

  const handleGarageClick = (garage) => {
    setSelectedCoordinates({
      lat: garage.location.coordinates[1],
      lng: garage.location.coordinates[0],
    });
    setSelectedGarage(garage);
    setLocateUser(false); // Stop focusing on user location when a garage is clicked
  };

  const handleLocateMeClick = () => {
    setLocateUser(true);
    setSelectedCoordinates(null); // Clear selected garage coordinates when locating user
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      {/* Filters Section */}
      <div className="filters-section">
        {/* Location Filter */}
        <div className="filter-container">
          <label htmlFor="district-select">Select Location:</label>
          <select
            id="district-select"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="filter-dropdown"
          >
            {districts.map((district) => (
              <option key={district.name} value={district.name}>{district.name}</option>
            ))}
          </select>
        </div>

        {/* Service Category Filter */}
        <div className="filter-container">
          <label htmlFor="service-select">Service Category:</label>
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
          <label htmlFor="vehicle-select">Vehicle Type:</label>
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

        {/* Locate Me Button */}
        <button
          className="locate-me-button"
          onClick={handleLocateMeClick}
          style={{ marginTop: '20px', padding: '10px', fontSize: '1rem', cursor: 'pointer' }}
        >
          Locate Me
        </button>
      </div>

      {/* Show Error if exists */}
      {error && <p className="error-text">{error}</p>}

      {/* Show Results */}
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <MapComponent
            garages={garages}
            selectedCoordinates={selectedCoordinates}
            locateUser={locateUser}
            selectedGarage={selectedGarage}
          />
          <ul className="garage-list">
            {garages.map((garage) => (
              <li
                key={garage._id}
                className="garage-item"
                onClick={() => handleGarageClick(garage)}
                style={{ cursor: 'pointer' }}
              >
                <strong>{garage.name}</strong> - {garage.city}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

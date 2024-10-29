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
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedService, setSelectedService] = useState('All Services');
  const [selectedVehicle, setSelectedVehicle] = useState('All Types');

  // Access auth context if available
  const { token } = useContext(AuthContext);

  // Get the list of cities based on the selected district
  const getCitiesForDistrict = () => {
    const district = districts.find((d) => d.name === selectedDistrict);
    if (district) {
      // Insert "All of [District]" only once and at the beginning
      return [`All of ${selectedDistrict}`, ...district.cities.filter(city => city !== `All of ${selectedDistrict}`)];
    }
    return [];
  };

  // Use useCallback to memoize the fetchGarages function
  const fetchGarages = useCallback(async () => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors

      // Fetch garages with filters
      const response = await axios.get('http://localhost:5001/api/garages', {
        headers: { Authorization: `Bearer ${token}` }, // Use token from context
        params: {
          district: selectedDistrict !== 'All of Sri Lanka' ? selectedDistrict : undefined,
          city: selectedCity && selectedCity !== `All of ${selectedDistrict}` ? selectedCity : undefined,
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
  }, [selectedDistrict, selectedCity, selectedService, selectedVehicle, token]);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchGarages(); // Fetch data when dependencies change
  }, [fetchGarages]); // Include fetchGarages in the dependency array

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
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedCity(`All of ${e.target.value}`); // Set default city to "All of [District]"
            }}
            className="filter-dropdown"
          >
            {districts.map((district) => (
              <option key={district.name} value={district.name}>{district.name}</option>
            ))}
          </select>
        </div>

        {/* City Filter - Only show if a specific district is selected */}
        {selectedDistrict !== 'All of Sri Lanka' && (
          <div className="filter-container">
            <label htmlFor="city-select">Filter by City:</label>
            <select
              id="city-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="filter-dropdown"
            >
              {getCitiesForDistrict().map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        )}

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

        {/* Search Button */}
        <button 
          className="search-button" 
          onClick={fetchGarages} 
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Show Error if exists */}
      {error && <p className="error-text">{error}</p>}

      {/* Show Results */}
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <MapComponent garages={garages} />
          <ul className="garage-list">
            {garages.map((garage) => (
              <li key={garage._id} className="garage-item">
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

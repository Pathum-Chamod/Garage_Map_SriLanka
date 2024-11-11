import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import MapComponent from '../components/MapComponent';
import { AuthContext } from '../context/AuthContext';
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

  const { token } = useContext(AuthContext);

  // Fetch garages with filters
  const fetchGarages = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

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

  useEffect(() => {
    fetchGarages();
  }, [fetchGarages]);

  const handleGarageClick = (garage) => {
    setSelectedCoordinates({
      lat: garage.location.coordinates[1],
      lng: garage.location.coordinates[0],
    });
    setSelectedGarage(garage);
    setLocateUser(false);
  };

  const handleLocateMeClick = () => {
    setLocateUser(true);
    setSelectedCoordinates(null);
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      <div className="filters-section">
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

        <button
          className="locate-me-button"
          onClick={handleLocateMeClick}
          style={{ marginTop: '20px', padding: '10px', fontSize: '1rem', cursor: 'pointer' }}
        >
          Locate Me
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <MapComponent
            garages={garages}
            selectedCoordinates={selectedCoordinates}
            locateUser={locateUser}
            selectedGarage={selectedGarage}
            setSelectedGarage={setSelectedGarage}
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

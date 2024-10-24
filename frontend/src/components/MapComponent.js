import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React from 'react';

// Define container style for the map
const containerStyle = {
  width: '100%',
  height: '400px' // Adjust the height to your preference
};

// Set a default center (example: Colombo, Sri Lanka)
const defaultCenter = {
  lat: 6.9271,
  lng: 79.8612
};

function MapComponent({ garages }) {
  // Your actual Google Maps API key
  const googleMapsApiKey = 'AIzaSyDqiRKcbDS4OX8B8gx5TJUTYoBvBibn8f4';

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={10} // Adjust the zoom level to your preference
      >
        {/* Add markers dynamically for each garage */}
        {garages.map((garage) => (
          <Marker
            key={garage._id}
            position={{
              lat: garage.location.coordinates[1], // Latitude
              lng: garage.location.coordinates[0], // Longitude
            }}
            title={garage.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;

import { Circle, DirectionsRenderer, GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React, { useCallback, useEffect, useState } from 'react';

// Define container style for the map
const containerStyle = {
  width: '100%',
  height: '500px', // Adjust the height to your preference
};

// Set a default center (example: Colombo, Sri Lanka)
const defaultCenter = {
  lat: 6.9271,
  lng: 79.8612,
};

function MapComponent({ garages = [], selectedCoordinates, locateUser }) {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [geoWatchId, setGeoWatchId] = useState(null);

  const googleMapsApiKey = 'AIzaSyDqiRKcbDS4OX8B8gx5TJUTYoBvBibn8f4';

  // Effect for focusing on user location when `locateUser` is triggered
  useEffect(() => {
    if (locateUser && userLocation && map) {
      // Pan and zoom to the user's current location
      map.panTo(userLocation);
      map.setZoom(16);
    }
  }, [locateUser, userLocation, map]);

  // Start live location tracking when the component mounts or `geoWatchId` is null
  const startLiveLocationTracking = useCallback(() => {
    if (navigator.geolocation && geoWatchId === null) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(currentPosition);
          if (map && locateUser) {
            map.panTo(currentPosition);
            map.setZoom(16);
          }
        },
        (error) => {
          console.error('Error fetching location:', error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
      setGeoWatchId(watchId);
    } else if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
    }
  }, [map, locateUser, geoWatchId]);

  // Stop live location tracking
  const stopLiveLocationTracking = useCallback(() => {
    if (geoWatchId !== null) {
      navigator.geolocation.clearWatch(geoWatchId);
      setGeoWatchId(null);
    }
  }, [geoWatchId]);

  // Effect for starting/stopping geolocation tracking
  useEffect(() => {
    startLiveLocationTracking();
    // Clean up the watch on unmount
    return () => stopLiveLocationTracking();
  }, [startLiveLocationTracking, stopLiveLocationTracking]);

  // Function to get directions to the selected garage from the user's current location
  const getDirections = (destination) => {
    if (userLocation) {
      const DirectionsService = new window.google.maps.DirectionsService();
      DirectionsService.route(
        {
          origin: userLocation,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    } else {
      console.error('User location is not available.');
    }
  };

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={selectedCoordinates || userLocation || defaultCenter}
        zoom={10}
        onLoad={(map) => setMap(map)}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }}
      >
        {/* Display user's current location as a blue circle */}
        {userLocation && (
          <Circle
            center={userLocation}
            radius={20}
            options={{
              fillColor: '#4285F4',
              fillOpacity: 0.4,
              strokeColor: '#4285F4',
              strokeOpacity: 0.8,
              strokeWeight: 1,
            }}
          />
        )}

        {/* Display marker for the selected garage */}
        {selectedCoordinates && (
          <Marker
            position={selectedCoordinates}
            title="Selected Garage"
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', // Red pin for selected garage
            }}
          />
        )}

        {/* Display markers for each garage */}
        {garages && garages.length > 0 && garages.map((garage) => (
          <Marker
            key={garage._id}
            position={{
              lat: garage.location.coordinates[1], // Latitude
              lng: garage.location.coordinates[0], // Longitude
            }}
            title={garage.name}
            onClick={() =>
              getDirections({
                lat: garage.location.coordinates[1],
                lng: garage.location.coordinates[0],
              })
            }
          />
        ))}

        {/* Display directions if available */}
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;

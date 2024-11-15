import { Circle, DirectionsRenderer, GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import React, { useCallback, useEffect, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 6.9271,
  lng: 79.8612,
};

function MapComponent({ garages = [], selectedCoordinates, locateUser, selectedGarage, setSelectedGarage }) {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [geoWatchId, setGeoWatchId] = useState(null);

  const googleMapsApiKey = 'AIzaSyDqiRKcbDS4OX8B8gx5TJUTYoBvBibn8f4';

  useEffect(() => {
    if (locateUser && userLocation && map) {
      map.panTo(userLocation);
      map.setZoom(16);
    }
  }, [locateUser, userLocation, map]);

  useEffect(() => {
    if (selectedGarage && map) {
      map.panTo({
        lat: selectedGarage.location.coordinates[1],
        lng: selectedGarage.location.coordinates[0],
      });
      map.setZoom(16);
    }
  }, [selectedGarage, map]);

  const startLiveLocationTracking = useCallback(() => {
    if (navigator.geolocation && geoWatchId === null) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(currentPosition);
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
  }, [geoWatchId]);

  const stopLiveLocationTracking = useCallback(() => {
    if (geoWatchId !== null) {
      navigator.geolocation.clearWatch(geoWatchId);
      setGeoWatchId(null);
    }
  }, [geoWatchId]);

  useEffect(() => {
    startLiveLocationTracking();
    return () => stopLiveLocationTracking();
  }, [startLiveLocationTracking, stopLiveLocationTracking]);

  // Function to get directions to the selected garage
  const getDirections = (destination) => {
    if (userLocation) {
      // Ask the user if they want to open Google Maps
      const userConfirmed = window.confirm(
        'Do you want to open Google Maps for directions? Click "OK" to open Google Maps or "Cancel" to view directions here.'
      );

      if (userConfirmed) {
        // If user wants to open Google Maps, construct the Google Maps URL and open it
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
        window.open(googleMapsUrl, '_blank');
      } else {
        // Otherwise, get the directions on the current map
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
      }

      // Close the InfoWindow after getting directions
      setSelectedGarage(null);
    } else {
      console.error('User location is not available.');
    }
  };

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={selectedCoordinates || userLocation || defaultCenter}
        zoom={10}
        onLoad={(map) => setMap(map)}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
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

        {garages.length > 0 &&
          garages.map((garage) => (
            <Marker
              key={garage._id}
              position={{
                lat: garage.location.coordinates[1],
                lng: garage.location.coordinates[0],
              }}
              title={garage.name}
              onClick={() => {
                setSelectedGarage(garage);
              }}
            />
          ))}

        {selectedGarage && (
          <InfoWindow
            position={{
              lat: selectedGarage.location.coordinates[1],
              lng: selectedGarage.location.coordinates[0],
            }}
            onCloseClick={() => setSelectedGarage(null)}
          >
            <div className="info-window">
              <h4>{selectedGarage.name}</h4>
              <p>Address: {selectedGarage.mailAddress}</p>
              <p>Telephone: {selectedGarage.phoneNumber}</p>
              <button
                onClick={() =>
                  getDirections({
                    lat: selectedGarage.location.coordinates[1],
                    lng: selectedGarage.location.coordinates[0],
                  })
                }
              >
                Get Directions
              </button>
            </div>
          </InfoWindow>
        )}

        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;

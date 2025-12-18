import React, { useState, useCallback } from 'react';
import { GoogleMap as GoogleMapComponent, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { CircularProgress, Typography, Alert, AlertTitle } from '@mui/material';
import { GOOGLE_MAPS_CONFIG, isGoogleMapsConfigured } from '../../../config/googleMaps';
import PlacesAutocomplete from './PlacesAutocomplete';
import type { GoogleMapProps, PlaceDetails } from './GoogleMap.types';
import {
  MapContainer,
  MapWrapper,
  SearchBoxContainer,
  LoadingContainer,
  ErrorContainer,
  MarkerInfoWindow,
  StyledSearchInput,
} from './GoogleMap.styles';

/**
 * GoogleMap Component
 * A reusable Google Maps component with places search functionality
 *
 * Features:
 * - Interactive map with zoom and pan controls
 * - Places autocomplete search
 * - Markers with info windows
 * - Customizable center and zoom level
 * - Click to add markers
 */
const GoogleMap: React.FC<GoogleMapProps> = ({
  center = GOOGLE_MAPS_CONFIG.defaultCenter,
  zoom = GOOGLE_MAPS_CONFIG.defaultZoom,
  markers = [],
  onLocationSelect,
  height = '600px',
  width = '100%',
  showSearchBox = true,
  className,
}) => {
  const [selectedMarker, setSelectedMarker] = useState<PlaceDetails | null>(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(zoom);

  // Handle place selection from search
  const handlePlaceSelect = useCallback(
    (place: PlaceDetails) => {
      setMapCenter(place.location);
      setMapZoom(15);
      onLocationSelect?.(place);
    },
    [onLocationSelect]
  );

  // Handle map click
  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;

      const location = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };

      // Use Geocoding to get address from coordinates
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          const placeDetails: PlaceDetails = {
            address: results[0].formatted_address,
            location,
            placeId: results[0].place_id,
          };
          onLocationSelect?.(placeDetails);
        } else {
          // If geocoding fails, just use coordinates
          const placeDetails: PlaceDetails = {
            address: `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`,
            location,
          };
          onLocationSelect?.(placeDetails);
        }
      });
    },
    [onLocationSelect]
  );

  // Check if API key is configured
  if (!isGoogleMapsConfigured()) {
    return (
      <MapContainer sx={{ height, width }} className={className}>
        <ErrorContainer>
          <Alert severity="error" sx={{ maxWidth: 600 }}>
            <AlertTitle>Google Maps Not Configured</AlertTitle>
            <Typography variant="body2" component="div" gutterBottom>
              Please add your Google Maps API key to continue:
            </Typography>
            <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Get an API key from Google Cloud Console</li>
              <li>Enable Maps JavaScript API, Places API, and Geocoding API</li>
              <li>Add VITE_GOOGLE_MAPS_API_KEY to your .env file</li>
              <li>Restart the development server</li>
            </ol>
          </Alert>
        </ErrorContainer>
      </MapContainer>
    );
  }

  return (
    <MapContainer sx={{ height, width }} className={className}>
      <LoadScript
        googleMapsApiKey={GOOGLE_MAPS_CONFIG.apiKey}
        libraries={GOOGLE_MAPS_CONFIG.libraries}
        loadingElement={
          <LoadingContainer>
            <CircularProgress />
            <Typography variant="body2" color="textSecondary">
              Loading Google Maps...
            </Typography>
          </LoadingContainer>
        }
      >
        <MapWrapper>
          {showSearchBox && (
            <SearchBoxContainer>
              <PlacesAutocomplete
                onPlaceSelect={handlePlaceSelect}
                placeholder="Search for a location..."
              />
            </SearchBoxContainer>
          )}

          <GoogleMapComponent
            center={mapCenter}
            zoom={mapZoom}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            options={GOOGLE_MAPS_CONFIG.mapOptions}
            onClick={handleMapClick}
          >
            {/* Render markers */}
            {markers.map((marker, index) => (
              <Marker
                key={`${marker.location.lat}-${marker.location.lng}-${index}`}
                position={marker.location}
                onClick={() => setSelectedMarker(marker)}
              />
            ))}

            {/* Show info window for selected marker */}
            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.location}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <MarkerInfoWindow>
                  {selectedMarker.name && (
                    <Typography variant="subtitle2" component="h6">
                      {selectedMarker.name}
                    </Typography>
                  )}
                  <Typography variant="body2" component="p">
                    {selectedMarker.address}
                  </Typography>
                </MarkerInfoWindow>
              </InfoWindow>
            )}
          </GoogleMapComponent>
        </MapWrapper>
      </LoadScript>
    </MapContainer>
  );
};

export default GoogleMap;

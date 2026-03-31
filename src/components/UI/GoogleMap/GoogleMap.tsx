import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useJsApiLoader, GoogleMap as GoogleMapComponent, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { CircularProgress, Typography, Alert, AlertTitle, Box, Chip, Button, IconButton } from '@mui/material';
import DirectionsIcon from '@mui/icons-material/Directions';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { GOOGLE_MAPS_CONFIG, isGoogleMapsConfigured } from '../../../config/googleMaps';
import PlacesAutocomplete from './PlacesAutocomplete';
import type { GoogleMapProps, PlaceDetails, Location } from './GoogleMap.types';
import {
  MapContainer,
  MapWrapper,
  LoadingContainer,
  ErrorContainer,
  MarkerInfoWindow,
  RouteInfoPanel,
} from './GoogleMap.styles';

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: '#4caf50',
  IN_PROGRESS: '#2196f3',
  PENDING: '#ff9800',
};

const GoogleMap: React.FC<GoogleMapProps> = ({
  center = GOOGLE_MAPS_CONFIG.defaultCenter,
  zoom = GOOGLE_MAPS_CONFIG.defaultZoom,
  markers = [],
  onLocationSelect,
  selectedLocation,
  focusedMarker,
  autoFitBounds = false,
  height = '600px',
  width = '100%',
  showSearchBox = true,
  searchInitialValue,
  className,
  showDirections = false,
}) => {
  const resolvedHeight = typeof height === 'number' ? `${height}px` : height;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.apiKey,
    libraries: GOOGLE_MAPS_CONFIG.libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  const [selectedMarker, setSelectedMarker] = useState<PlaceDetails | null>(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [directionsResult, setDirectionsResult] = useState<google.maps.DirectionsResult | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [directionsLoading, setDirectionsLoading] = useState(false);
  const [directionsError, setDirectionsError] = useState<string | null>(null);

  const allMarkers = useMemo(() => {
    const list = [...markers];
    if (selectedLocation) {
      const overlaps = markers.some(
        (m) =>
          Math.abs(m.location.lat - selectedLocation.location.lat) < 0.001 &&
          Math.abs(m.location.lng - selectedLocation.location.lng) < 0.001
      );
      if (!overlaps) list.push(selectedLocation);
    }
    return list;
  }, [markers, selectedLocation]);

  useEffect(() => {
    setMapCenter(center);
    setMapZoom(zoom);
  }, [center, zoom]);

  // Auto-fit the map viewport to show every marker whenever the marker list changes
  useEffect(() => {
    if (!autoFitBounds || !mapRef.current || markers.length === 0) return;
    if (markers.length === 1) {
      mapRef.current.setCenter(markers[0].location);
      mapRef.current.setZoom(14);
    } else {
      const bounds = new google.maps.LatLngBounds();
      markers.forEach((m) => bounds.extend(m.location));
      mapRef.current.fitBounds(bounds, 80);
    }
  }, [markers, autoFitBounds]);

  // When a marker is focused externally (e.g. clicked in side panel list), pan directly to it
  useEffect(() => {
    if (!focusedMarker) return;
    setSelectedMarker(focusedMarker);
    if (mapRef.current) {
      mapRef.current.panTo(focusedMarker.location);
      mapRef.current.setZoom(16);
    } else {
      setMapCenter(focusedMarker.location);
      setMapZoom(16);
    }
  }, [focusedMarker]);

  const handleGetDirections = useCallback((destination: Location) => {
    if (!navigator.geolocation) {
      setDirectionsError('Geolocation is not supported by your browser.');
      return;
    }
    setDirectionsLoading(true);
    setDirectionsError(null);
    setDirectionsResult(null);
    setRouteInfo(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const origin = { lat: position.coords.latitude, lng: position.coords.longitude };
        const service = new google.maps.DirectionsService();
        service.route(
          { origin, destination, travelMode: google.maps.TravelMode.DRIVING },
          (result, status) => {
            setDirectionsLoading(false);
            if (status === google.maps.DirectionsStatus.OK && result) {
              setDirectionsResult(result);
              const leg = result.routes[0]?.legs[0];
              if (leg) {
                setRouteInfo({ distance: leg.distance?.text ?? '', duration: leg.duration?.text ?? '' });
              }
              if (mapRef.current && result.routes[0]?.bounds) {
                mapRef.current.fitBounds(result.routes[0].bounds, 80);
              }
              setSelectedMarker(null);
            } else {
              setDirectionsError('Could not calculate route. Please try again.');
            }
          }
        );
      },
      (err) => {
        setDirectionsLoading(false);
        setDirectionsError(
          err.code === err.PERMISSION_DENIED
            ? 'Location access denied. Please allow location access and try again.'
            : 'Could not get your location. Please try again.'
        );
      },
      { timeout: 10000 }
    );
  }, []);

  const clearDirections = useCallback(() => {
    setDirectionsResult(null);
    setRouteInfo(null);
    setDirectionsError(null);
  }, []);

  const handlePlaceSelect = useCallback(
    (place: PlaceDetails) => {
      setMapCenter(place.location);
      setMapZoom(15);
      onLocationSelect?.(place);
    },
    [onLocationSelect]
  );

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const location = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          onLocationSelect?.({ address: results[0].formatted_address, location, placeId: results[0].place_id });
        } else {
          onLocationSelect?.({ address: `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`, location });
        }
      });
    },
    [onLocationSelect]
  );

  if (!isGoogleMapsConfigured()) {
    return (
      <MapContainer sx={{ height: resolvedHeight, width }} className={className}>
        <ErrorContainer>
          <Alert severity="error">
            <AlertTitle>Google Maps Not Configured</AlertTitle>
            <Typography variant="body2">Add VITE_GOOGLE_MAPS_API_KEY to your .env file and restart.</Typography>
          </Alert>
        </ErrorContainer>
      </MapContainer>
    );
  }

  if (loadError) {
    return (
      <MapContainer sx={{ height: resolvedHeight, width }} className={className}>
        <ErrorContainer>
          <Alert severity="error">
            <AlertTitle>Failed to load Google Maps</AlertTitle>
            <Typography variant="body2">Check your API key and ensure Maps JavaScript API is enabled.</Typography>
          </Alert>
        </ErrorContainer>
      </MapContainer>
    );
  }

  if (!isLoaded) {
    return (
      <MapContainer sx={{ height: resolvedHeight, width }} className={className}>
        <LoadingContainer>
          <CircularProgress />
          <Typography variant="body2" color="textSecondary">Loading Google Maps...</Typography>
        </LoadingContainer>
      </MapContainer>
    );
  }

  return (
    <Box sx={{ width, height: resolvedHeight, display: 'flex', flexDirection: 'column', gap: 1 }}>
      {showSearchBox && (
        <PlacesAutocomplete onPlaceSelect={handlePlaceSelect} placeholder="Search for a location..." defaultValue={searchInitialValue} />
      )}
      <MapContainer sx={{ flex: 1, minHeight: 0, width: '100%' }} className={className}>
        <MapWrapper>

        <GoogleMapComponent
          center={mapCenter}
          zoom={mapZoom}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={GOOGLE_MAPS_CONFIG.mapOptions}
          onClick={handleMapClick}
          onLoad={(map) => { mapRef.current = map; }}
        >
          {allMarkers.map((marker, index) => {
            const jobStatus = marker.jobLocationData?.status;
            const isInProgress = jobStatus === 'IN_PROGRESS';
            // Standard teardrop pin shape (same as Google Maps default marker, scaled by status)
            const markerIcon: google.maps.Symbol | undefined = jobStatus
              ? {
                  // Standard Google Maps teardrop path (24×24 viewBox, tip at bottom-centre)
                  path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
                  fillColor: STATUS_COLORS[jobStatus] ?? '#9e9e9e',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 1.5,
                  scale: isInProgress ? 2.2 : 1.7,
                  anchor: new google.maps.Point(12, 22),
                }
              : undefined;

            return (
              <Marker
                key={`${marker.location.lat}-${marker.location.lng}-${index}`}
                position={marker.location}
                icon={markerIcon}
                onClick={() => setSelectedMarker(marker)}
              />
            );
          })}

          {directionsResult && (
            <DirectionsRenderer
              directions={directionsResult}
              options={{
                suppressMarkers: false,
                polylineOptions: {
                  strokeColor: '#1976d2',
                  strokeWeight: 5,
                  strokeOpacity: 0.85,
                },
              }}
            />
          )}

          {selectedMarker && (
            <InfoWindow position={selectedMarker.location} onCloseClick={() => setSelectedMarker(null)}>
              <MarkerInfoWindow>
                {selectedMarker.jobLocationData ? (
                  <Box sx={{ minWidth: 220, maxWidth: 300 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1976d2' }}>
                        Job #{selectedMarker.jobLocationData.jobId}
                      </Typography>
                      <Chip
                        label={selectedMarker.jobLocationData.status.replace('_', ' ')}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '0.6rem',
                          backgroundColor: STATUS_COLORS[selectedMarker.jobLocationData.status] ?? '#9e9e9e',
                          color: '#fff',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ display: 'block', color: '#555', mb: 0.5 }}>
                      {selectedMarker.address}
                    </Typography>
                    {selectedMarker.jobLocationData.clientName && (
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 0.25 }}>
                        <Typography variant="caption" sx={{ color: '#888', fontWeight: 600 }}>Client:</Typography>
                        <Typography variant="caption" sx={{ color: '#555' }}>{selectedMarker.jobLocationData.clientName}</Typography>
                      </Box>
                    )}
                    {selectedMarker.jobLocationData.customerName && (
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 0.25 }}>
                        <Typography variant="caption" sx={{ color: '#888', fontWeight: 600 }}>Customer:</Typography>
                        <Typography variant="caption" sx={{ color: '#555' }}>{selectedMarker.jobLocationData.customerName}</Typography>
                      </Box>
                    )}
                    {selectedMarker.jobLocationData.workerName && (
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 0.25 }}>
                        <Typography variant="caption" sx={{ color: '#888', fontWeight: 600 }}>Worker:</Typography>
                        <Typography variant="caption" sx={{ color: '#555' }}>{selectedMarker.jobLocationData.workerName}</Typography>
                      </Box>
                    )}
                    {selectedMarker.jobLocationData.scheduledTime && (
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#888', fontWeight: 600 }}>Scheduled:</Typography>
                        <Typography variant="caption" sx={{ color: '#555' }}>{selectedMarker.jobLocationData.scheduledTime}</Typography>
                      </Box>
                    )}
                    {showDirections && (
                      <Box sx={{ mt: 1 }}>
                        <Button
                          size="small"
                          variant="contained"
                          fullWidth
                          startIcon={directionsLoading ? <CircularProgress size={13} color="inherit" /> : <DirectionsIcon />}
                          onClick={() => handleGetDirections(selectedMarker.location)}
                          disabled={directionsLoading}
                          sx={{ fontSize: '0.72rem', py: 0.6, textTransform: 'none' }}
                        >
                          {directionsLoading ? 'Getting route…' : 'Get Directions'}
                        </Button>
                        {directionsError && (
                          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                            {directionsError}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                ) : selectedMarker.workerData ? (
                  <Box sx={{ minWidth: 220, maxWidth: 300 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {selectedMarker.workerData.workerName}
                    </Typography>
                    {selectedMarker.workerData.workerEmail && (
                      <Typography variant="caption" sx={{ display: 'block', color: '#555' }}>
                        {selectedMarker.workerData.workerEmail}
                      </Typography>
                    )}
                    {selectedMarker.workerData.workerPhone && (
                      <Typography variant="caption" sx={{ display: 'block', color: '#555', mb: 1 }}>
                        {selectedMarker.workerData.workerPhone}
                      </Typography>
                    )}
                    <Typography variant="caption" sx={{ display: 'block', color: '#888', mb: 1 }}>
                      {selectedMarker.address}
                    </Typography>
                    {selectedMarker.workerData.jobs.map((job) => (
                      <Box key={job.jobId} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5, borderTop: '1px solid #eee' }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, backgroundColor: STATUS_COLORS[job.status] ?? '#9e9e9e' }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1976d2' }}>#{job.jobId}</Typography>
                        {job.clientName && <Typography variant="caption" sx={{ color: '#555' }}>{job.clientName}</Typography>}
                        <Chip
                          label={job.status}
                          size="small"
                          sx={{ height: 16, fontSize: '0.6rem', backgroundColor: STATUS_COLORS[job.status] ?? '#9e9e9e', color: '#fff', ml: 'auto' }}
                        />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box>
                    {selectedMarker.name && <Typography variant="subtitle2" component="h6">{selectedMarker.name}</Typography>}
                    <Typography variant="body2" component="p">{selectedMarker.address}</Typography>
                  </Box>
                )}
              </MarkerInfoWindow>
            </InfoWindow>
          )}
        </GoogleMapComponent>

        {showDirections && routeInfo && (
          <RouteInfoPanel>
            <DirectionsCarIcon sx={{ color: '#1976d2', fontSize: 22, flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#1976d2', display: 'block', lineHeight: 1.2 }}>
                {routeInfo.duration}
              </Typography>
              <Typography variant="caption" sx={{ color: '#555', display: 'block', lineHeight: 1.2 }}>
                {routeInfo.distance} via driving
              </Typography>
            </Box>
            <IconButton size="small" onClick={clearDirections} sx={{ ml: 'auto', p: 0.5 }}>
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </RouteInfoPanel>
        )}
        </MapWrapper>
      </MapContainer>
    </Box>
  );
};

export default GoogleMap;

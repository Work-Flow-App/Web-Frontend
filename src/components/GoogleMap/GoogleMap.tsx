import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useJsApiLoader, GoogleMap as GoogleMapComponent, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { CircularProgress, Alert, AlertTitle } from '@mui/material';
import DirectionsIcon from '@mui/icons-material/Directions';
import CloseIcon from '@mui/icons-material/Close';
import { GOOGLE_MAPS_CONFIG, isGoogleMapsConfigured } from '../../config/googleMaps';
import PlacesAutocomplete from './PlacesAutocomplete';
import type { GoogleMapProps, PlaceDetails } from './GoogleMap.types';
import {
  MapContainer,
  MapWrapper,
  LoadingContainer,
  ErrorContainer,
  MarkerInfoWindow,
  RouteInfoPanel,
  MapOuterBox,
  InfoWindowRoot,
  InfoWindowHeader,
  InfoWindowRow,
  InfoWindowStatusDot,
  WorkerJobRow,
  DirectionsButtonBox,
  RouteInfoIconBox,
  JobIdText,
  AddressCaptionText,
  LabelCaptionText,
  ValueCaptionText,
  WorkerNameText,
  WorkerContactText,
  WorkerPhoneText,
  WorkerAddressText,
  JobIdChipText,
  JobClientText,
  DirectionsErrorText,
  RouteDurationText,
  RouteDistanceText,
  JobStatusChip,
  WorkerJobChip,
  DirectionsButton,
  RouteCarIcon,
  ClearDirectionsButton,
} from './GoogleMap.styles';
import {
  STATUS_COLORS,
  DIRECTIONS_RENDERER_OPTIONS,
  MAP_CONTAINER_STYLE,
  getMarkerIcon,
  getGeolocationErrorMessage,
} from './GoogleMapConst';
import { extractAddressComponents } from './PlacesAutocompleteConst';
import { Typography } from '@mui/material';

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
  const [manualAddressHint, setManualAddressHint] = useState<string | null>(null);

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

  const handleGetDirections = useCallback((destination: google.maps.LatLngLiteral) => {
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
        setDirectionsError(getGeolocationErrorMessage(err));
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
      if (place.isManualAddressOnly) {
        setManualAddressHint(`Address saved as "${place.address}". Click on the map to set the pin location.`);
      } else {
        setManualAddressHint(null);
        setMapCenter(place.location);
        setMapZoom(15);
      }
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
          const components = extractAddressComponents(results[0].address_components);
          onLocationSelect?.({
            address: results[0].formatted_address,
            location,
            placeId: results[0].place_id,
            ...components,
          });
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
    <MapOuterBox sx={{ width, height: resolvedHeight }}>
      {showSearchBox && (
        <PlacesAutocomplete
          onPlaceSelect={handlePlaceSelect}
          placeholder="Search for a location..."
          defaultValue={searchInitialValue}
        />
      )}
      {manualAddressHint && (
        <Alert severity="info" onClose={() => setManualAddressHint(null)} sx={{ py: 0.5 }}>
          {manualAddressHint}
        </Alert>
      )}
      <MapContainer sx={{ flex: 1, minHeight: 0, width: '100%' }} className={className}>
        <MapWrapper>
          <GoogleMapComponent
            center={mapCenter}
            zoom={mapZoom}
            mapContainerStyle={MAP_CONTAINER_STYLE}
            options={GOOGLE_MAPS_CONFIG.mapOptions}
            onClick={handleMapClick}
            onLoad={(map) => { mapRef.current = map; }}
          >
            {allMarkers.map((marker, index) => {
              const jobStatus = marker.jobLocationData?.status;
              const isInProgress = jobStatus === 'IN_PROGRESS';
              return (
                <Marker
                  key={`${marker.location.lat}-${marker.location.lng}-${index}`}
                  position={marker.location}
                  icon={getMarkerIcon(jobStatus, isInProgress)}
                  onClick={() => setSelectedMarker(marker)}
                />
              );
            })}

            {directionsResult && (
              <DirectionsRenderer
                directions={directionsResult}
                options={DIRECTIONS_RENDERER_OPTIONS}
              />
            )}

            {selectedMarker && (
              <InfoWindow position={selectedMarker.location} onCloseClick={() => setSelectedMarker(null)}>
                <MarkerInfoWindow>
                  {selectedMarker.jobLocationData ? (
                    <InfoWindowRoot>
                      <InfoWindowHeader>
                        <JobIdText variant="subtitle2">
                          Job #{selectedMarker.jobLocationData.jobId}
                        </JobIdText>
                        <JobStatusChip
                          label={selectedMarker.jobLocationData.status.replace('_', ' ')}
                          size="small"
                          statusColor={STATUS_COLORS[selectedMarker.jobLocationData.status] ?? '#9e9e9e'}
                        />
                      </InfoWindowHeader>
                      <AddressCaptionText variant="caption">
                        {selectedMarker.address}
                      </AddressCaptionText>
                      {selectedMarker.jobLocationData.customerName && (
                        <InfoWindowRow>
                          <LabelCaptionText variant="caption">Customer:</LabelCaptionText>
                          <ValueCaptionText variant="caption">{selectedMarker.jobLocationData.customerName}</ValueCaptionText>
                        </InfoWindowRow>
                      )}
                      {selectedMarker.jobLocationData.workerName && (
                        <InfoWindowRow>
                          <LabelCaptionText variant="caption">Worker:</LabelCaptionText>
                          <ValueCaptionText variant="caption">{selectedMarker.jobLocationData.workerName}</ValueCaptionText>
                        </InfoWindowRow>
                      )}
                      {selectedMarker.jobLocationData.scheduledTime && (
                        <InfoWindowRow>
                          <LabelCaptionText variant="caption">Scheduled:</LabelCaptionText>
                          <ValueCaptionText variant="caption">{selectedMarker.jobLocationData.scheduledTime}</ValueCaptionText>
                        </InfoWindowRow>
                      )}
                      {showDirections && (
                        <DirectionsButtonBox>
                          <DirectionsButton
                            size="small"
                            variant="contained"
                            fullWidth
                            startIcon={directionsLoading ? <CircularProgress size={13} color="inherit" /> : <DirectionsIcon />}
                            onClick={() => handleGetDirections(selectedMarker.location)}
                            disabled={directionsLoading}
                          >
                            {directionsLoading ? 'Getting route…' : 'Get Directions'}
                          </DirectionsButton>
                          {directionsError && (
                            <DirectionsErrorText variant="caption" color="error">
                              {directionsError}
                            </DirectionsErrorText>
                          )}
                        </DirectionsButtonBox>
                      )}
                    </InfoWindowRoot>
                  ) : selectedMarker.workerData ? (
                    <InfoWindowRoot>
                      <WorkerNameText variant="subtitle2">
                        {selectedMarker.workerData.workerName}
                      </WorkerNameText>
                      {selectedMarker.workerData.workerEmail && (
                        <WorkerContactText variant="caption">
                          {selectedMarker.workerData.workerEmail}
                        </WorkerContactText>
                      )}
                      {selectedMarker.workerData.workerPhone && (
                        <WorkerPhoneText variant="caption">
                          {selectedMarker.workerData.workerPhone}
                        </WorkerPhoneText>
                      )}
                      <WorkerAddressText variant="caption">
                        {selectedMarker.address}
                      </WorkerAddressText>
                      {selectedMarker.workerData.jobs.map((job) => (
                        <WorkerJobRow key={job.jobId}>
                          <InfoWindowStatusDot statusColor={STATUS_COLORS[job.status] ?? '#9e9e9e'} />
                          <JobIdChipText variant="caption">#{job.jobId}</JobIdChipText>
                          {job.clientName && <JobClientText variant="caption">{job.clientName}</JobClientText>}
                          <WorkerJobChip
                            label={job.status}
                            size="small"
                            statusColor={STATUS_COLORS[job.status] ?? '#9e9e9e'}
                          />
                        </WorkerJobRow>
                      ))}
                    </InfoWindowRoot>
                  ) : (
                    <div>
                      {selectedMarker.name && <Typography variant="subtitle2" component="h6">{selectedMarker.name}</Typography>}
                      <Typography variant="body2" component="p">{selectedMarker.address}</Typography>
                    </div>
                  )}
                </MarkerInfoWindow>
              </InfoWindow>
            )}
          </GoogleMapComponent>

          {showDirections && routeInfo && (
            <RouteInfoPanel>
              <RouteCarIcon />
              <RouteInfoIconBox>
                <RouteDurationText variant="caption">{routeInfo.duration}</RouteDurationText>
                <RouteDistanceText variant="caption">{routeInfo.distance} via driving</RouteDistanceText>
              </RouteInfoIconBox>
              <ClearDirectionsButton onClick={clearDirections} aria-label="Clear directions">
                <CloseIcon />
              </ClearDirectionsButton>
            </RouteInfoPanel>
          )}
        </MapWrapper>
      </MapContainer>
    </MapOuterBox>
  );
};

export default GoogleMap;
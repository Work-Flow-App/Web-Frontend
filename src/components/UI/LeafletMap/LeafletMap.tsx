import React, { useState, useCallback } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { Typography, CircularProgress, IconButton, Tooltip } from '@mui/material';
import TrafficIcon from '@mui/icons-material/Traffic';
import L from 'leaflet';
import { LEAFLET_CONFIG, NOMINATIM_CONFIG, TOMTOM_CONFIG, isTomTomConfigured } from '../../../config/googleMaps';
import LocationSearch from './LocationSearch';
import type { LeafletMapProps, PlaceDetails } from './LeafletMap.types';
import {
  MapContainer,
  SearchBoxContainer,
  MarkerPopupContent,
  GeocodingLoadingOverlay,
  TrafficToggleButton,
} from './LeafletMap.styles';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Webpack/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

/**
 * MapClickHandler Component
 * Handles click events on the map
 */
interface MapClickHandlerProps {
  onLocationSelect?: (location: PlaceDetails) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onLocationSelect }) => {
  const [loading, setLoading] = useState(false);

  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;

      if (!onLocationSelect) return;

      setLoading(true);
      try {
        // Reverse geocode to get address
        const params = new URLSearchParams({
          lat: lat.toString(),
          lon: lng.toString(),
          format: 'json',
        });

        const response = await fetch(`${NOMINATIM_CONFIG.baseUrl}/reverse?${params}`, {
          headers: {
            'User-Agent': 'WorkFlow App',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const placeDetails: PlaceDetails = {
            address: data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            location: { lat, lng },
            placeId: data.place_id?.toString(),
          };
          onLocationSelect(placeDetails);
        } else {
          // If geocoding fails, just use coordinates
          onLocationSelect({
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            location: { lat, lng },
          });
        }
      } catch (error) {
        console.error('Error reverse geocoding:', error);
        onLocationSelect({
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          location: { lat, lng },
        });
      } finally {
        setLoading(false);
      }
    },
  });

  if (loading) {
    return (
      <GeocodingLoadingOverlay>
        <CircularProgress size={24} />
      </GeocodingLoadingOverlay>
    );
  }

  return null;
};

/**
 * TrafficLayerHandler Component
 * Manages the traffic layer overlay
 */
interface TrafficLayerHandlerProps {
  showTraffic: boolean;
}

const TrafficLayerHandler: React.FC<TrafficLayerHandlerProps> = ({ showTraffic }) => {
  const map = useMap();

  React.useEffect(() => {
    if (!isTomTomConfigured()) {
      return;
    }

    let trafficFlowLayer: L.TileLayer | null = null;
    let trafficIncidentsLayer: L.TileLayer | null = null;

    if (showTraffic) {
      // Add traffic flow layer
      trafficFlowLayer = L.tileLayer(
        `${TOMTOM_CONFIG.trafficFlow.url}?key=${TOMTOM_CONFIG.apiKey}`,
        {
          attribution: TOMTOM_CONFIG.trafficFlow.attribution,
          opacity: TOMTOM_CONFIG.trafficFlow.opacity,
          zIndex: TOMTOM_CONFIG.trafficFlow.zIndex,
        }
      );

      // Add traffic incidents layer
      trafficIncidentsLayer = L.tileLayer(
        `${TOMTOM_CONFIG.trafficIncidents.url}?key=${TOMTOM_CONFIG.apiKey}`,
        {
          attribution: TOMTOM_CONFIG.trafficIncidents.attribution,
          opacity: TOMTOM_CONFIG.trafficIncidents.opacity,
          zIndex: TOMTOM_CONFIG.trafficIncidents.zIndex,
        }
      );

      trafficFlowLayer.addTo(map);
      trafficIncidentsLayer.addTo(map);
    }

    return () => {
      if (trafficFlowLayer) {
        map.removeLayer(trafficFlowLayer);
      }
      if (trafficIncidentsLayer) {
        map.removeLayer(trafficIncidentsLayer);
      }
    };
  }, [showTraffic, map]);

  return null;
};

/**
 * LeafletMap Component
 * A reusable OpenStreetMap component with location search
 *
 * Features:
 * - 100% FREE - No API key required
 * - Interactive map with zoom and pan controls
 * - Location search using Nominatim
 * - Click to add markers
 * - Customizable center and zoom level
 * - Reverse geocoding
 * - Optional traffic layer (requires TomTom API key)
 */
const LeafletMap: React.FC<LeafletMapProps> = ({
  center = LEAFLET_CONFIG.defaultCenter,
  zoom = LEAFLET_CONFIG.defaultZoom,
  markers = [],
  onLocationSelect,
  height = '600px',
  width = '100%',
  showSearchBox = true,
  className,
  selectedLocation = null,
}) => {
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [mapKey, setMapKey] = useState(0); // Force re-render when center changes
  const [showTraffic, setShowTraffic] = useState(false);

  // Update map center when center prop changes
  React.useEffect(() => {
    setMapCenter(center);
    setMapZoom(13); // Zoom in when location changes
    setMapKey((prev) => prev + 1); // Force map to re-render
  }, [center.lat, center.lng]);

  // Handle place selection from search
  const handlePlaceSelect = useCallback(
    (place: PlaceDetails) => {
      setMapCenter(place.location);
      setMapZoom(13);
      setMapKey((prev) => prev + 1); // Force map to re-center
      onLocationSelect?.(place);
    },
    [onLocationSelect]
  );

  const handleTrafficToggle = () => {
    setShowTraffic((prev) => !prev);
  };

  return (
    <MapContainer sx={{ height, width }} className={className}>
      {showSearchBox && (
        <SearchBoxContainer>
          <LocationSearch
            onPlaceSelect={handlePlaceSelect}
            placeholder="Search for a location..."
            currentValue={selectedLocation?.address}
          />
        </SearchBoxContainer>
      )}

      {isTomTomConfigured() && (
        <TrafficToggleButton>
          <Tooltip title={showTraffic ? 'Hide Traffic' : 'Show Traffic'}>
            <IconButton onClick={handleTrafficToggle} className={showTraffic ? 'active' : ''} size="small">
              <TrafficIcon />
            </IconButton>
          </Tooltip>
        </TrafficToggleButton>
      )}

      <LeafletMapContainer
        key={mapKey}
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={mapZoom}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution={LEAFLET_CONFIG.tileLayer.attribution}
          url={LEAFLET_CONFIG.tileLayer.url}
          maxZoom={LEAFLET_CONFIG.tileLayer.maxZoom}
        />

        <MapClickHandler onLocationSelect={onLocationSelect} />
        <TrafficLayerHandler showTraffic={showTraffic} />

        {/* Render markers */}
        {markers.map((marker, index) => (
          <Marker
            key={`${marker.location.lat}-${marker.location.lng}-${index}`}
            position={[marker.location.lat, marker.location.lng]}
          >
            <Popup>
              <MarkerPopupContent>
                {marker.workerData ? (
                  // Worker-Job marker popup
                  <>
                    <Typography variant="subtitle2" component="h6" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                      {marker.workerData.workerName}
                    </Typography>
                    {marker.workerData.workerEmail && (
                      <Typography variant="caption" component="p" style={{ marginBottom: '4px' }}>
                        {marker.workerData.workerEmail}
                      </Typography>
                    )}
                    {marker.workerData.workerPhone && (
                      <Typography variant="caption" component="p" style={{ marginBottom: '8px' }}>
                        {marker.workerData.workerPhone}
                      </Typography>
                    )}
                    <Typography variant="body2" style={{ fontWeight: 'bold', marginTop: '8px', marginBottom: '4px' }}>
                      Jobs ({marker.workerData.jobs.length}):
                    </Typography>
                    {marker.workerData.jobs.map((job) => (
                      <div key={job.jobId} style={{ marginBottom: '8px', paddingLeft: '8px', borderLeft: '2px solid #1976d2' }}>
                        <Typography variant="caption" component="p" style={{ fontWeight: 'bold' }}>
                          Job #{job.jobId}
                        </Typography>
                        <Typography variant="caption" component="p">
                          Status: {job.status}
                        </Typography>
                        {job.scheduledTime && (
                          <Typography variant="caption" component="p">
                            Time: {job.scheduledTime}
                          </Typography>
                        )}
                        {job.clientName && (
                          <Typography variant="caption" component="p">
                            Client: {job.clientName}
                          </Typography>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  // Standard location marker popup
                  <>
                    {marker.name && (
                      <Typography variant="subtitle2" component="h6">
                        {marker.name}
                      </Typography>
                    )}
                    <Typography variant="body2" component="p">
                      {marker.address}
                    </Typography>
                  </>
                )}
              </MarkerPopupContent>
            </Popup>
          </Marker>
        ))}
      </LeafletMapContainer>
    </MapContainer>
  );
};

export default LeafletMap;

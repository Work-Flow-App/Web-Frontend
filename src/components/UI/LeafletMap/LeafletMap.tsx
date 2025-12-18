import React, { useState, useCallback } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Typography, CircularProgress } from '@mui/material';
import L from 'leaflet';
import { LEAFLET_CONFIG, NOMINATIM_CONFIG } from '../../../config/googleMaps';
import LocationSearch from './LocationSearch';
import type { LeafletMapProps, PlaceDetails } from './LeafletMap.types';
import { MapContainer, SearchBoxContainer, LoadingContainer, MarkerPopupContent } from './LeafletMap.styles';
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
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        <CircularProgress size={24} />
      </div>
    );
  }

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
}) => {
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [mapKey, setMapKey] = useState(0); // Force re-render when center changes

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

  return (
    <MapContainer sx={{ height, width }} className={className}>
      {showSearchBox && (
        <SearchBoxContainer>
          <LocationSearch onPlaceSelect={handlePlaceSelect} placeholder="Search for a location..." />
        </SearchBoxContainer>
      )}

      <LeafletMapContainer
        key={mapKey}
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution={LEAFLET_CONFIG.tileLayer.attribution}
          url={LEAFLET_CONFIG.tileLayer.url}
          maxZoom={LEAFLET_CONFIG.tileLayer.maxZoom}
        />

        <MapClickHandler onLocationSelect={onLocationSelect} />

        {/* Render markers */}
        {markers.map((marker, index) => (
          <Marker
            key={`${marker.location.lat}-${marker.location.lng}-${index}`}
            position={[marker.location.lat, marker.location.lng]}
          >
            <Popup>
              <MarkerPopupContent>
                {marker.name && (
                  <Typography variant="subtitle2" component="h6">
                    {marker.name}
                  </Typography>
                )}
                <Typography variant="body2" component="p">
                  {marker.address}
                </Typography>
              </MarkerPopupContent>
            </Popup>
          </Marker>
        ))}
      </LeafletMapContainer>
    </MapContainer>
  );
};

export default LeafletMap;

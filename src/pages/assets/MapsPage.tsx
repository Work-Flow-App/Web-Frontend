import React, { useState } from 'react';
import { Box, Typography, Paper, Chip, Stack } from '@mui/material';
import { LeafletMap } from '../../components/UI/LeafletMap';
import type { PlaceDetails } from '../../components/UI/LeafletMap';
import { POPULAR_LOCATIONS, LEAFLET_CONFIG } from '../../config/googleMaps';
import {
  PageContainer,
  PageHeader,
  Title,
  ContentSection,
  MapSection,
  SidePanel,
  LocationChipContainer,
  LocationInfo,
  InfoLabel,
  InfoValue,
} from './MapsPage.styles';

/**
 * MapsPage Component
 * Displays an interactive map with location search and quick access to popular locations
 * Uses OpenStreetMap (FREE - No API key required)
 */
export const MapsPage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<PlaceDetails | null>(null);
  const [mapCenter, setMapCenter] = useState(LEAFLET_CONFIG.defaultCenter); // Start with world view
  const [markers, setMarkers] = useState<PlaceDetails[]>([]);

  // Handle location selection from map
  const handleLocationSelect = (location: PlaceDetails) => {
    setSelectedLocation(location);
    setMapCenter(location.location);
    setMarkers([location]); // Show single marker for selected location
  };

  // Handle quick location selection from chips
  const handleQuickLocation = (location: { name: string; lat: number; lng: number }) => {
    const quickLocation: PlaceDetails = {
      name: location.name,
      address: `${location.name}, Bangladesh`,
      location: { lat: location.lat, lng: location.lng },
    };
    setSelectedLocation(quickLocation);
    setMapCenter(location); // Update map center to trigger re-render
    setMarkers([quickLocation]);
  };

  return (
    <PageContainer>
      <PageHeader>
        <Title>Maps</Title>
        <Typography variant="body2" color="textSecondary">
          Search for locations or select from popular cities
        </Typography>
      </PageHeader>

      <ContentSection>
        <MapSection>
          <LeafletMap
            center={mapCenter}
            markers={markers}
            onLocationSelect={handleLocationSelect}
            showSearchBox
            height="calc(100vh - 250px)"
          />
        </MapSection>

        <SidePanel>
          <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.paper', height: '100%' }}>
            <Stack spacing={3}>
              {/* Quick Location Access */}
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Quick Locations
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
                  Select a popular city in Bangladesh
                </Typography>
                <LocationChipContainer>
                  {POPULAR_LOCATIONS.map((location) => (
                    <Chip
                      key={location.name}
                      label={location.name}
                      onClick={() => handleQuickLocation(location)}
                      color={
                        selectedLocation?.name === location.name ||
                        (mapCenter.lat === location.lat && mapCenter.lng === location.lng)
                          ? 'primary'
                          : 'default'
                      }
                      variant={
                        selectedLocation?.name === location.name ||
                        (mapCenter.lat === location.lat && mapCenter.lng === location.lng)
                          ? 'filled'
                          : 'outlined'
                      }
                    />
                  ))}
                </LocationChipContainer>
              </Box>

              {/* Selected Location Details */}
              {selectedLocation && (
                <LocationInfo>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                    Selected Location
                  </Typography>

                  {selectedLocation.name && (
                    <Box sx={{ mb: 2 }}>
                      <InfoLabel>Name</InfoLabel>
                      <InfoValue>{selectedLocation.name}</InfoValue>
                    </Box>
                  )}

                  <Box sx={{ mb: 2 }}>
                    <InfoLabel>Address</InfoLabel>
                    <InfoValue>{selectedLocation.address}</InfoValue>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <InfoLabel>Coordinates</InfoLabel>
                    <InfoValue>
                      Lat: {selectedLocation.location.lat.toFixed(6)}
                      <br />
                      Lng: {selectedLocation.location.lng.toFixed(6)}
                    </InfoValue>
                  </Box>

                  {selectedLocation.placeId && (
                    <Box>
                      <InfoLabel>Place ID</InfoLabel>
                      <InfoValue sx={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>
                        {selectedLocation.placeId}
                      </InfoValue>
                    </Box>
                  )}
                </LocationInfo>
              )}

              {/* Instructions */}
              {!selectedLocation && (
                <Box sx={{ p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    <strong>How to use:</strong>
                    <br />
                    • Search for any location using the search bar
                    <br />
                    • Click on the map to select a location
                    <br />
                    • Use quick access chips for popular cities
                    <br />
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        </SidePanel>
      </ContentSection>
    </PageContainer>
  );
};

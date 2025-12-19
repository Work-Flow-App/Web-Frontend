import React, { useState } from 'react';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import { LeafletMap } from '../../../../components/UI/LeafletMap';
import type { PlaceDetails } from '../../../../components/UI/LeafletMap';
import { POPULAR_LOCATIONS, LEAFLET_CONFIG } from '../../../../config/googleMaps';
import * as S from './MapsList.styles';

export const MapsList: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<PlaceDetails | null>(null);
  const [mapCenter, setMapCenter] = useState(LEAFLET_CONFIG.defaultCenter);
  const [markers, setMarkers] = useState<PlaceDetails[]>([]);

  // Handle location selection from map
  const handleLocationSelect = (location: PlaceDetails) => {
    setSelectedLocation(location);
    setMapCenter(location.location);
    setMarkers([location]);
  };

  // Handle quick location selection from chips
  const handleQuickLocation = (location: { name: string; lat: number; lng: number }) => {
    const quickLocation: PlaceDetails = {
      name: location.name,
      address: `${location.name}, Ukraine`,
      location: { lat: location.lat, lng: location.lng },
    };
    setSelectedLocation(quickLocation);
    setMapCenter(location);
    setMarkers([quickLocation]);
  };

  const isLocationSelected = (location: { name: string; lat: number; lng: number }) => {
    return (
      selectedLocation?.name === location.name ||
      (mapCenter.lat === location.lat && mapCenter.lng === location.lng)
    );
  };

  return (
    <PageWrapper title="Maps" description="Search for locations or select from popular cities" showSearch={false}>
      <S.ContentSection>
        <S.MapSection>
          <LeafletMap
            center={mapCenter}
            markers={markers}
            onLocationSelect={handleLocationSelect}
            showSearchBox
            height="100%"
          />
        </S.MapSection>

        <S.SidePanel>
          <S.SidePanelPaper elevation={0}>
            <S.QuickLocationSection>
              <S.SectionTitle variant="subtitle2">Quick Locations</S.SectionTitle>
              <S.SectionDescription variant="caption" color="textSecondary">
                Select a popular city in Ukraine
              </S.SectionDescription>
              <S.LocationChipContainer>
                {POPULAR_LOCATIONS.map((location) => (
                  <S.LocationChip
                    key={location.name}
                    label={location.name}
                    onClick={() => handleQuickLocation(location)}
                    color={isLocationSelected(location) ? 'primary' : 'default'}
                    variant={isLocationSelected(location) ? 'filled' : 'outlined'}
                  />
                ))}
              </S.LocationChipContainer>
            </S.QuickLocationSection>

            {selectedLocation && (
              <S.LocationInfo>
                <S.LocationDetailsSection>
                  <S.SectionTitle variant="subtitle2">Selected Location</S.SectionTitle>

                  {selectedLocation.name && (
                    <S.InfoRow>
                      <S.InfoLabel>Name</S.InfoLabel>
                      <S.InfoValue>{selectedLocation.name}</S.InfoValue>
                    </S.InfoRow>
                  )}

                  <S.InfoRow>
                    <S.InfoLabel>Address</S.InfoLabel>
                    <S.InfoValue>{selectedLocation.address}</S.InfoValue>
                  </S.InfoRow>

                  <S.InfoRow>
                    <S.InfoLabel>Coordinates</S.InfoLabel>
                    <S.InfoValue>
                      Lat: {selectedLocation.location.lat.toFixed(6)}
                      <br />
                      Lng: {selectedLocation.location.lng.toFixed(6)}
                    </S.InfoValue>
                  </S.InfoRow>

                  {selectedLocation.placeId && (
                    <S.InfoRow>
                      <S.InfoLabel>Place ID</S.InfoLabel>
                      <S.PlaceIdValue>{selectedLocation.placeId}</S.PlaceIdValue>
                    </S.InfoRow>
                  )}
                </S.LocationDetailsSection>
              </S.LocationInfo>
            )}

            {!selectedLocation && (
              <S.InstructionsBox>
                <S.InstructionsText variant="caption">
                  <strong>How to use:</strong>
                  <br />
                  • Search for any location using the search bar
                  <br />
                  • Click on the map to select a location
                  <br />
                  • Use quick access chips for popular cities
                </S.InstructionsText>
              </S.InstructionsBox>
            )}
          </S.SidePanelPaper>
        </S.SidePanel>
      </S.ContentSection>
    </PageWrapper>
  );
};

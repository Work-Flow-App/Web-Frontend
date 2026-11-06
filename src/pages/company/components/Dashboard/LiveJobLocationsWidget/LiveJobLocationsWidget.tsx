import React from 'react';
import { CircularProgress } from '@mui/material';
import GoogleMap from '../../../../../components/UI/GoogleMap/GoogleMap';
import { useJobLocationMarkers } from '../../../dashboardQueries';
import * as S from './LiveJobLocationsWidget.styles';

interface LiveJobLocationsWidgetProps {
  onViewFullMap: () => void;
}

export const LiveJobLocationsWidget: React.FC<LiveJobLocationsWidgetProps> = ({ onViewFullMap }) => {
  const { markers, isLoading } = useJobLocationMarkers();

  return (
    <S.Container>
      <S.Header>
        <S.TitleText variant="h6">Live Job Locations</S.TitleText>
        <S.ActionLink onClick={onViewFullMap}>View Full Map</S.ActionLink>
      </S.Header>
      <S.MapWrapper>
        {isLoading && (
          <S.LoadingOverlay>
            <CircularProgress size={30} />
          </S.LoadingOverlay>
        )}
        <GoogleMap
          markers={markers}
          height="100%"
          width="100%"
          showSearchBox={false}
          autoFitBounds={true}
          zoom={12}
          center={{ lat: 51.5074, lng: -0.1278 }}
        />
      </S.MapWrapper>
    </S.Container>
  );
};

import React from 'react';
import { CircularProgress } from '@mui/material';
import GoogleMap from '../../../../../components/UI/GoogleMap/GoogleMap';
import type { PlaceDetails } from '../../../../../components/UI/GoogleMap/GoogleMap.types';
import * as S from './LiveJobLocationsWidget.styles';

interface LiveJobLocationsWidgetProps {
  onViewFullMap: () => void;
  markers?: PlaceDetails[];
  loading?: boolean;
}

export const LiveJobLocationsWidget: React.FC<LiveJobLocationsWidgetProps> = ({
  onViewFullMap,
  markers = [],
  loading = false,
}) => {
  return (
    <S.Container>
      <S.Header>
        <S.TitleText variant="h6">Live Job Locations</S.TitleText>
        <S.ActionLink onClick={onViewFullMap}>View Full Map</S.ActionLink>
      </S.Header>
      <S.MapWrapper>
        {loading && (
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

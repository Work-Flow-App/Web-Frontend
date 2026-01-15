import React from 'react';
import type { JobResponse, AssetResponse } from '../../../../../services/api';
import * as S from '../../../JobDetailsPage.styles';
import NumbersIcon from '@mui/icons-material/Numbers';
import CategoryIcon from '@mui/icons-material/Category';

interface JobAssetsTabProps {
  job: JobResponse;
  assets: AssetResponse[];
}

// Generate consistent colors for assets
const assetColors = [
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#FF9800', // Orange
  '#9C27B0', // Purple
  '#F44336', // Red
  '#00BCD4', // Cyan
  '#FF5722', // Deep Orange
  '#3F51B5', // Indigo
  '#009688', // Teal
  '#E91E63', // Pink
  '#673AB7', // Deep Purple
  '#FFC107', // Amber
];

const getAssetColor = (index: number): string => {
  return assetColors[index % assetColors.length];
};

export const JobAssetsTab: React.FC<JobAssetsTabProps> = ({ job, assets }) => {
  return (
    <>
      <S.DetailsSectionTitle>Assets</S.DetailsSectionTitle>
      <S.DetailsContent>
        {job.assetIds && job.assetIds.length > 0 ? (
          <>
            <S.DetailRow>
              <S.DetailLabel>
                <S.FieldIcon>
                  <NumbersIcon fontSize="small" />
                </S.FieldIcon>
                Total Assets
              </S.DetailLabel>
              <S.DetailValue>{job.assetIds.length}</S.DetailValue>
            </S.DetailRow>
            <S.DetailRow>
              <S.DetailLabel>
                <S.FieldIcon>
                  <CategoryIcon fontSize="small" />
                </S.FieldIcon>
                Assets
              </S.DetailLabel>
              <S.DetailValue>
                {assets.length > 0 ? (
                  <S.AssetChipsContainer>
                    {assets.map((asset, index) => (
                      <S.AssetChip key={asset.id || index} style={{ backgroundColor: getAssetColor(index) }}>
                        {asset.name}
                      </S.AssetChip>
                    ))}
                  </S.AssetChipsContainer>
                ) : (
                  job.assetIds.join(', ')
                )}
              </S.DetailValue>
            </S.DetailRow>
          </>
        ) : (
          <S.PlaceholderText>No assets linked to this job</S.PlaceholderText>
        )}
      </S.DetailsContent>
    </>
  );
};

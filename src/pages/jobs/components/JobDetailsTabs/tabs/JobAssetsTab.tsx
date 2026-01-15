import React from 'react';
import type { JobResponse, AssetResponse } from '../../../../../services/api';
import * as S from '../../../JobDetailsPage.styles';
import InventoryIcon from '@mui/icons-material/Inventory';
import Inventory2Icon from '@mui/icons-material/Inventory2';

interface JobAssetsTabProps {
  job: JobResponse;
  assets: AssetResponse[];
}

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
                  <InventoryIcon fontSize="small" />
                </S.FieldIcon>
                Total Assets
              </S.DetailLabel>
              <S.DetailValue>{job.assetIds.length}</S.DetailValue>
            </S.DetailRow>
            <S.DetailRow>
              <S.DetailLabel>
                <S.FieldIcon>
                  <Inventory2Icon fontSize="small" />
                </S.FieldIcon>
                Assets
              </S.DetailLabel>
              <S.DetailValue>
                {assets.length > 0 ? assets.map((asset) => asset.name).join(', ') : job.assetIds.join(', ')}
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

import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { jobService } from '../../../../services/api';
import * as S from './OverviewField.styles';

interface JobValueProps {
  jobId: number;
  workflowUpdateTrigger?: number;
}

export const JobValue: React.FC<JobValueProps> = ({ jobId, workflowUpdateTrigger = 0 }) => {
  const [value, setValue] = useState<number | string | null | undefined>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobValue = async () => {
      try {
        setLoading(true);
        const response = await jobService.getJobById(jobId);
        // Extract estimateTotalNet from the fresh job data
        setValue((response.data as any).estimateTotalNet);
      } catch (error) {
        console.error('Failed to fetch fresh job value:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobValue();
  }, [jobId, workflowUpdateTrigger]);

  return (
    <S.OverviewCard>
      <S.CardLabel>Job Value</S.CardLabel>
      {loading ? (
        <CircularProgress size={24} />
      ) : (
        <S.CardValueContainer>
          <S.CardValueMain>{value !== null && value !== undefined ? value : '-'}</S.CardValueMain>
        </S.CardValueContainer>
      )}
    </S.OverviewCard>
  );
};

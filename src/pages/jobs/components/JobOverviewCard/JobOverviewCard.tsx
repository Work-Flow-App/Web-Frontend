import React from 'react';
import { Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { JobResponse, ClientResponse, WorkerResponse, JobTemplateResponse } from '../../../../services/api';
import { Button } from '../../../../components/UI/Button';
import * as S from '../../JobDetailsPage.styles';

interface JobOverviewCardProps {
  job: JobResponse;
  client: ClientResponse | null;
  worker: WorkerResponse | null;
  template: JobTemplateResponse | null;
  onBackClick: () => void;
}

export const JobOverviewCard: React.FC<JobOverviewCardProps> = ({ job, client, worker, template, onBackClick }) => {
  return (
    <S.JobOverviewCard>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <S.JobTitle style={{ margin: 0 }}>
          {client?.name || 'No Client'} - {template?.name || 'No Template'}
        </S.JobTitle>
        <Button onClick={onBackClick} variant="outlined" startIcon={<ArrowBackIcon />}>
          Back to Jobs
        </Button>
      </Box>
      <S.JobDescription>Job #{job.id} details</S.JobDescription>

      <S.MetadataRow>
        <S.MetadataColumn>
          <S.MetadataLabel>Status</S.MetadataLabel>
          <S.MetadataValue>
            <S.StatusBadge statusType={job.status}>
              <S.StatusIcon />
              {job.status || 'N/A'}
            </S.StatusBadge>
          </S.MetadataValue>
        </S.MetadataColumn>

        <S.MetadataColumn>
          <S.MetadataLabel>Assigned to</S.MetadataLabel>
          <S.MetadataValue>{worker?.name || 'Unassigned'}</S.MetadataValue>
        </S.MetadataColumn>

        <S.MetadataColumn>
          <S.MetadataLabel>Template</S.MetadataLabel>
          <S.MetadataValue>{template?.name || '-'}</S.MetadataValue>
        </S.MetadataColumn>

        <S.MetadataColumn>
          <S.MetadataLabel>Client</S.MetadataLabel>
          <S.MetadataValue>
            {client?.name && <S.Avatar>{client.name.charAt(0).toUpperCase()}</S.Avatar>}
            {client?.name || '-'}
          </S.MetadataValue>
        </S.MetadataColumn>

        <S.TagsContainer>
          {job.archived ? <S.Tag color="#9E9E9E">Archived</S.Tag> : <S.Tag color="#2196F3">Active</S.Tag>}
        </S.TagsContainer>
      </S.MetadataRow>
    </S.JobOverviewCard>
  );
};

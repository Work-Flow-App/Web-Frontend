import React from 'react';
import type { JobResponse, ClientResponse, WorkerResponse, JobTemplateResponse } from '../../../../services/api';
import * as S from '../../JobDetailsPage.styles';

interface JobOverviewCardProps {
  job: JobResponse;
  client: ClientResponse | null;
  worker: WorkerResponse | null;
  template: JobTemplateResponse | null;
}

export const JobOverviewCard: React.FC<JobOverviewCardProps> = ({ job, client, worker, template }) => {
  return (
    <S.JobOverviewCard>
      <S.JobTitle>
        {client?.name || 'No Client'} - {template?.name || 'No Template'}
      </S.JobTitle>
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

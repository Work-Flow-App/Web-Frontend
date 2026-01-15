import React from 'react';
import type { JobResponse } from '../../../../../services/api';
import * as S from '../../../JobDetailsPage.styles';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface JobInfoTabProps {
  job: JobResponse;
  formatDate: (dateString?: string) => string;
}

export const JobInfoTab: React.FC<JobInfoTabProps> = ({ job, formatDate }) => {
  return (
    <>
      <S.DetailsSectionTitle>Job information</S.DetailsSectionTitle>
      <S.DetailsContent>
        <S.DetailRow>
          <S.DetailLabel>
            <S.FieldIcon>
              <FingerprintIcon fontSize="small" />
            </S.FieldIcon>
            Job ID
          </S.DetailLabel>
          <S.DetailValue>{job.id}</S.DetailValue>
        </S.DetailRow>

        <S.DetailRow>
          <S.DetailLabel>
            <S.FieldIcon>
              <CategoryIcon fontSize="small" />
            </S.FieldIcon>
            Status
          </S.DetailLabel>
          <S.DetailValue>
            <S.StatusBadge statusType={job.status}>
              <S.StatusIcon />
              {job.status || 'N/A'}
            </S.StatusBadge>
          </S.DetailValue>
        </S.DetailRow>

        <S.DetailRow>
          <S.DetailLabel>
            <S.FieldIcon>
              <CategoryIcon fontSize="small" />
            </S.FieldIcon>
            Archived
          </S.DetailLabel>
          <S.DetailValue>{job.archived ? 'Yes' : 'No'}</S.DetailValue>
        </S.DetailRow>

        <S.DetailRow>
          <S.DetailLabel>
            <S.FieldIcon>
              <CalendarTodayIcon fontSize="small" />
            </S.FieldIcon>
            Created At
          </S.DetailLabel>
          <S.DetailValue>{formatDate(job.createdAt)}</S.DetailValue>
        </S.DetailRow>

        <S.DetailRow>
          <S.DetailLabel>
            <S.FieldIcon>
              <CalendarTodayIcon fontSize="small" />
            </S.FieldIcon>
            Updated At
          </S.DetailLabel>
          <S.DetailValue>{formatDate(job.updatedAt)}</S.DetailValue>
        </S.DetailRow>
      </S.DetailsContent>
    </>
  );
};

import React from 'react';
import type { WorkerResponse } from '../../../../../services/api';
import * as S from '../../../JobDetailsPage.styles';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import BadgeIcon from '@mui/icons-material/Badge';

interface JobWorkerTabProps {
  worker: WorkerResponse | null;
}

export const JobWorkerTab: React.FC<JobWorkerTabProps> = ({ worker }) => {
  return (
    <>
      <S.DetailsSectionTitle>Worker information</S.DetailsSectionTitle>
      <S.DetailsContent>
        {worker ? (
          <>
            <S.DetailRow>
              <S.DetailLabel>
                <S.FieldIcon>
                  <PersonIcon fontSize="small" />
                </S.FieldIcon>
                Worker Name
              </S.DetailLabel>
              <S.DetailValue>{worker.name || '-'}</S.DetailValue>
            </S.DetailRow>

            <S.DetailRow>
              <S.DetailLabel>
                <S.FieldIcon>
                  <EmailIcon fontSize="small" />
                </S.FieldIcon>
                Email
              </S.DetailLabel>
              <S.DetailValue>{worker.email || '-'}</S.DetailValue>
            </S.DetailRow>

            <S.DetailRow>
              <S.DetailLabel>
                <S.FieldIcon>
                  <PhoneIcon fontSize="small" />
                </S.FieldIcon>
                Telephone
              </S.DetailLabel>
              <S.DetailValue>{worker.telephone || '-'}</S.DetailValue>
            </S.DetailRow>

            <S.DetailRow>
              <S.DetailLabel>
                <S.FieldIcon>
                  <PhoneAndroidIcon fontSize="small" />
                </S.FieldIcon>
                Mobile
              </S.DetailLabel>
              <S.DetailValue>{worker.mobile || '-'}</S.DetailValue>
            </S.DetailRow>

            <S.DetailRow>
              <S.DetailLabel>
                <S.FieldIcon>
                  <BadgeIcon fontSize="small" />
                </S.FieldIcon>
                Initials
              </S.DetailLabel>
              <S.DetailValue>{worker.initials || '-'}</S.DetailValue>
            </S.DetailRow>
          </>
        ) : (
          <S.PlaceholderText>No worker assigned to this job</S.PlaceholderText>
        )}
      </S.DetailsContent>
    </>
  );
};

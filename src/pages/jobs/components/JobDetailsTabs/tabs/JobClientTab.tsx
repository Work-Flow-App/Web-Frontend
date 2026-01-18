import React from 'react';
import type { ClientResponse } from '../../../../../services/api';
import * as S from '../../../JobDetailsPage.styles';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface JobClientTabProps {
  client: ClientResponse | null;
}

export const JobClientTab: React.FC<JobClientTabProps> = ({ client }) => {
  return (
    <>
      <S.DetailsSectionTitle>Client information</S.DetailsSectionTitle>
      <S.DetailsContent>
        {client ? (
          <>
            <S.DetailRow>
              <S.DetailLabel>
                <S.FieldIcon>
                  <BusinessIcon fontSize="small" />
                </S.FieldIcon>
                Client Name
              </S.DetailLabel>
              <S.DetailValue>{client.name || '-'}</S.DetailValue>
            </S.DetailRow>

            <S.DetailRow>
              <S.DetailLabel>
                <S.FieldIcon>
                  <EmailIcon fontSize="small" />
                </S.FieldIcon>
                Email
              </S.DetailLabel>
              <S.DetailValue>{client.email || '-'}</S.DetailValue>
            </S.DetailRow>

            <S.DetailRow>
              <S.DetailLabel>
                <S.FieldIcon>
                  <PhoneIcon fontSize="small" />
                </S.FieldIcon>
                Telephone
              </S.DetailLabel>
              <S.DetailValue>{client.telephone || '-'}</S.DetailValue>
            </S.DetailRow>

            <S.DetailRow>
              <S.DetailLabel>
                <S.FieldIcon>
                  <PhoneAndroidIcon fontSize="small" />
                </S.FieldIcon>
                Mobile
              </S.DetailLabel>
              <S.DetailValue>{client.mobile || '-'}</S.DetailValue>
            </S.DetailRow>

            <S.DetailRow>
              <S.DetailLabel>
                <S.FieldIcon>
                  <LocationOnIcon fontSize="small" />
                </S.FieldIcon>
                Address
              </S.DetailLabel>
              <S.DetailValue>{client.address || '-'}</S.DetailValue>
            </S.DetailRow>
          </>
        ) : (
          <S.PlaceholderText>No client assigned to this job</S.PlaceholderText>
        )}
      </S.DetailsContent>
    </>
  );
};

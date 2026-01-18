import React from 'react';
import type { JobTemplateResponse } from '../../../../../services/api';
import * as S from '../../../JobDetailsPage.styles';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface JobTemplateTabProps {
  template: JobTemplateResponse | null;
  formatDate: (dateString?: string) => string;
}

export const JobTemplateTab: React.FC<JobTemplateTabProps> = ({ template, formatDate }) => {
  return (
    <>
      <S.DetailsSectionTitle>Template information</S.DetailsSectionTitle>
      <S.DetailsContent>
        {template ? (
          <>
            <S.DetailRow>
              <S.DetailLabel>
                <S.FieldIcon>
                  <CategoryIcon fontSize="small" />
                </S.FieldIcon>
                Template Name
              </S.DetailLabel>
              <S.DetailValue>{template.name || '-'}</S.DetailValue>
            </S.DetailRow>

            {template.description && (
              <S.DetailRow>
                <S.DetailLabel>
                  <S.FieldIcon>
                    <DescriptionIcon fontSize="small" />
                  </S.FieldIcon>
                  Description
                </S.DetailLabel>
                <S.DetailValue>{template.description}</S.DetailValue>
              </S.DetailRow>
            )}

            <S.DetailRow>
              <S.DetailLabel>
                <S.FieldIcon>
                  <CategoryIcon fontSize="small" />
                </S.FieldIcon>
                Default Template
              </S.DetailLabel>
              <S.DetailValue>{template.default ? 'Yes' : 'No'}</S.DetailValue>
            </S.DetailRow>

            <S.DetailRow>
              <S.DetailLabel>
                <S.FieldIcon>
                  <CalendarTodayIcon fontSize="small" />
                </S.FieldIcon>
                Created At
              </S.DetailLabel>
              <S.DetailValue>{formatDate(template.createdAt)}</S.DetailValue>
            </S.DetailRow>

            <S.DetailRow>
              <S.DetailLabel>
                <S.FieldIcon>
                  <CalendarTodayIcon fontSize="small" />
                </S.FieldIcon>
                Updated At
              </S.DetailLabel>
              <S.DetailValue>{formatDate(template.updatedAt)}</S.DetailValue>
            </S.DetailRow>
          </>
        ) : (
          <S.PlaceholderText>No template assigned to this job</S.PlaceholderText>
        )}
      </S.DetailsContent>
    </>
  );
};

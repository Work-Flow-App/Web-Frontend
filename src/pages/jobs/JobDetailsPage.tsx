import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../components/UI/PageWrapper';
import * as S from './JobDetailsPage.styles';

export const JobDetailsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const handleJobsClick = () => {
    navigate('/company/jobs');
  };

  return (
    <PageWrapper
      title={
        <S.BreadcrumbContainer>
          <S.BreadcrumbLink onClick={handleJobsClick}>Jobs</S.BreadcrumbLink>
          <S.BreadcrumbSeparator>/</S.BreadcrumbSeparator>
          <S.BreadcrumbCurrent>{jobId}</S.BreadcrumbCurrent>
        </S.BreadcrumbContainer>
      }
      description=""
    >
      <S.ContentContainer>
        <S.DetailsGrid>
          {/* Section 1 */}
          <S.DetailsSection>
            <S.SectionTitle variant="subtitle2">sec 1</S.SectionTitle>
          </S.DetailsSection>

          {/* Section 2 */}
          <S.DetailsSection>
            <S.SectionTitle variant="subtitle2">sec 2</S.SectionTitle>
          </S.DetailsSection>

          {/* Section 3 */}
          <S.DetailsSection>
            <S.SectionTitle variant="subtitle2">sec 3</S.SectionTitle>
          </S.DetailsSection>
        </S.DetailsGrid>
      </S.ContentContainer>
    </PageWrapper>
  );
};

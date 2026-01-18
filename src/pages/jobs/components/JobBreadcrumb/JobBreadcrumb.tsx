import React from 'react';
import * as S from '../../JobDetailsPage.styles';

interface JobBreadcrumbProps {
  jobId: string;
  onJobsClick: () => void;
}

export const JobBreadcrumb: React.FC<JobBreadcrumbProps> = ({ jobId, onJobsClick }) => {
  return (
    <S.BreadcrumbContainer>
      <S.BreadcrumbLink onClick={onJobsClick}>Jobs</S.BreadcrumbLink>
      <S.BreadcrumbSeparator>/</S.BreadcrumbSeparator>
      <S.BreadcrumbCurrent>{jobId}</S.BreadcrumbCurrent>
    </S.BreadcrumbContainer>
  );
};

import React from 'react';
import { JobEventsSection } from './components/JobEventsSection';
import { PageContainer } from './CompanyPage.styles';

export const CompanyPage: React.FC = () => {
  return (
    <PageContainer>
      <JobEventsSection />
    </PageContainer>
  );
};

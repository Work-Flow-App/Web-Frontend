import React, { useMemo, useRef, useState } from 'react';
import { PageWrapper } from '../../components/UI/PageWrapper';
import { FormTemplatesList, type FormTemplatesListHandle } from './components/FormTemplatesList';
import { FormSubmissionsList, type FormSubmissionsListHandle } from './components/FormSubmissionsList';
import * as S from './FormsPage.styles';

export const FormsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const templatesRef = useRef<FormTemplatesListHandle>(null);
  const submissionsRef = useRef<FormSubmissionsListHandle>(null);

  const actions = useMemo(
    () => [
      activeTab === 0
        ? { label: 'Create Template', onClick: () => templatesRef.current?.openCreate(), variant: 'contained' as const, color: 'primary' as const }
        : { label: 'Create Submission', onClick: () => submissionsRef.current?.openCreate(), variant: 'contained' as const, color: 'primary' as const },
    ],
    [activeTab]
  );

  return (
    <PageWrapper
      title="Custom Forms"
      description="Build reusable form templates and send them to workers to fill in and submit."
      actions={actions}
    >
      <S.TabsWrapper>
        <S.StyledTabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <S.StyledTab label="Templates" />
          <S.StyledTab label="Submissions" />
        </S.StyledTabs>
      </S.TabsWrapper>

      {/* Both lists stay mounted so their data survives a tab switch, and their ref handle is always attached */}
      <S.TabPanel active={activeTab === 0}>
        <FormTemplatesList ref={templatesRef} />
      </S.TabPanel>
      <S.TabPanel active={activeTab === 1}>
        <FormSubmissionsList ref={submissionsRef} />
      </S.TabPanel>
    </PageWrapper>
  );
};

export default FormsPage;

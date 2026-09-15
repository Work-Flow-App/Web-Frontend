import React, { useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageWrapper } from '../../components/UI/PageWrapper';
import { FormTemplatesList, type FormTemplatesListHandle } from './components/FormTemplatesList';
import { FormSubmissionsList, type FormSubmissionsListHandle } from './components/FormSubmissionsList';
import * as S from './FormsPage.styles';

// Keeps the active tab in the URL (?tab=submissions) instead of local state, so links back to
// this page - e.g. "Back to Forms" from a submission's detail page - can land on the right tab
// instead of always resetting to Templates.
const SUBMISSIONS_TAB = 'submissions';

export const FormsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === SUBMISSIONS_TAB ? 1 : 0;
  const templatesRef = useRef<FormTemplatesListHandle>(null);
  const submissionsRef = useRef<FormSubmissionsListHandle>(null);

  const handleTabChange = useCallback(
    (_: React.SyntheticEvent, value: number) => {
      setSearchParams(value === 1 ? { tab: SUBMISSIONS_TAB } : {}, { replace: true });
    },
    [setSearchParams]
  );

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
        <S.StyledTabs value={activeTab} onChange={handleTabChange}>
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

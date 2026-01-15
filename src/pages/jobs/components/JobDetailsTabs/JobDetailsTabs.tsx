import React, { useState } from 'react';
import type {
  JobResponse,
  ClientResponse,
  WorkerResponse,
  JobTemplateResponse,
  JobTemplateFieldResponse,
  AssetResponse,
} from '../../../../services/api';
import * as S from '../../JobDetailsPage.styles';
import { JobClientTab } from './tabs/JobClientTab';
import { JobWorkerTab } from './tabs/JobWorkerTab';
import { JobTemplateTab } from './tabs/JobTemplateTab';
import { JobCustomFieldsTab } from './tabs/JobCustomFieldsTab';
import { JobAssetsTab } from './tabs/JobAssetsTab';
import { JobInfoTab } from './tabs/JobInfoTab';

interface JobDetailsTabsProps {
  job: JobResponse;
  client: ClientResponse | null;
  worker: WorkerResponse | null;
  template: JobTemplateResponse | null;
  templateFields: JobTemplateFieldResponse[];
  assets: AssetResponse[];
}

export const JobDetailsTabs: React.FC<JobDetailsTabsProps> = ({
  job,
  client,
  worker,
  template,
  templateFields,
  assets,
}) => {
  const [activeTab, setActiveTab] = useState('client');

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  return (
    <S.DetailsSection>
      {/* Tab Navigation */}
      <S.TabsContainer>
        <S.TabButton active={activeTab === 'client'} onClick={() => setActiveTab('client')}>
          Client
        </S.TabButton>
        <S.TabButton active={activeTab === 'worker'} onClick={() => setActiveTab('worker')}>
          Worker
        </S.TabButton>
        <S.TabButton active={activeTab === 'template'} onClick={() => setActiveTab('template')}>
          Template
        </S.TabButton>
        <S.TabButton active={activeTab === 'customFields'} onClick={() => setActiveTab('customFields')}>
          Custom Fields
        </S.TabButton>
        <S.TabButton active={activeTab === 'assets'} onClick={() => setActiveTab('assets')}>
          Assets
        </S.TabButton>
        <S.TabButton active={activeTab === 'info'} onClick={() => setActiveTab('info')}>
          Job Info
        </S.TabButton>
      </S.TabsContainer>

      {/* Tab Content */}
      <S.TabContent>
        {activeTab === 'client' && <JobClientTab client={client} />}
        {activeTab === 'worker' && <JobWorkerTab worker={worker} />}
        {activeTab === 'template' && <JobTemplateTab template={template} formatDate={formatDate} />}
        {activeTab === 'customFields' && <JobCustomFieldsTab job={job} templateFields={templateFields} />}
        {activeTab === 'assets' && <JobAssetsTab job={job} assets={assets} />}
        {activeTab === 'info' && <JobInfoTab job={job} formatDate={formatDate} />}
      </S.TabContent>
    </S.DetailsSection>
  );
};

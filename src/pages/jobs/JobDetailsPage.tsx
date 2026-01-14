import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { PageWrapper } from '../../components/UI/PageWrapper';
import { jobService, jobTemplateService, companyClientService, workerService } from '../../services/api';
import type { JobResponse, JobTemplateResponse, ClientResponse, WorkerResponse, JobTemplateFieldResponse } from '../../services/api';
import { useSnackbar } from '../../contexts/SnackbarContext';
import * as S from './JobDetailsPage.styles';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BadgeIcon from '@mui/icons-material/Badge';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import BusinessIcon from '@mui/icons-material/Business';

export const JobDetailsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { showError } = useSnackbar();

  const [job, setJob] = useState<JobResponse | null>(null);
  const [template, setTemplate] = useState<JobTemplateResponse | null>(null);
  const [templateFields, setTemplateFields] = useState<JobTemplateFieldResponse[]>([]);
  const [client, setClient] = useState<ClientResponse | null>(null);
  const [worker, setWorker] = useState<WorkerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('client');

  const fetchJobDetails = useCallback(async () => {
    if (!jobId) return;

    try {
      setLoading(true);

      // Fetch main job data
      const jobResponse = await jobService.getJobById(Number(jobId));
      const jobData = jobResponse.data;
      setJob(jobData);

      // Fetch related data in parallel
      const promises = [];

      if (jobData.templateId) {
        promises.push(
          jobTemplateService.getTemplateWithFields(jobData.templateId).then((res) => {
            setTemplate(res.data.template || null);
            setTemplateFields(res.data.fields || []);
          })
        );
      }

      if (jobData.clientId) {
        promises.push(
          companyClientService.getClientById(jobData.clientId).then((res) => setClient(res.data))
        );
      }

      if (jobData.assignedWorkerId) {
        promises.push(
          workerService.getWorkerById(jobData.assignedWorkerId).then((res) => setWorker(res.data))
        );
      }

      await Promise.all(promises);
    } catch (error) {
      console.error('Error fetching job details:', error);
      showError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  }, [jobId, showError]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  const handleJobsClick = () => {
    navigate('/company/jobs');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageWrapper>
    );
  }

  if (!job) {
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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <S.InfoValue>Job not found</S.InfoValue>
        </Box>
      </PageWrapper>
    );
  }

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
          {/* Section 1: Job Overview Card */}
          <S.JobOverviewCard>
            <S.JobTitle>
              {client?.name || 'No Client'} - {template?.name || 'No Template'}
            </S.JobTitle>
            <S.JobDescription>Job #{job.id} details</S.JobDescription>

            <S.MetadataRow>
              <S.MetadataColumn>
                <S.MetadataLabel>Status</S.MetadataLabel>
                <S.MetadataValue>
                  <S.StatusBadge statusType={job.status}>
                    <S.StatusIcon />
                    {job.status || 'N/A'}
                  </S.StatusBadge>
                </S.MetadataValue>
              </S.MetadataColumn>

              <S.MetadataColumn>
                <S.MetadataLabel>Assigned to</S.MetadataLabel>
                <S.MetadataValue>{worker?.name || 'Unassigned'}</S.MetadataValue>
              </S.MetadataColumn>

              <S.MetadataColumn>
                <S.MetadataLabel>Template</S.MetadataLabel>
                <S.MetadataValue>{template?.name || '-'}</S.MetadataValue>
              </S.MetadataColumn>

              <S.MetadataColumn>
                <S.MetadataLabel>Client</S.MetadataLabel>
                <S.MetadataValue>
                  {client?.name && (
                    <S.Avatar>{client.name.charAt(0).toUpperCase()}</S.Avatar>
                  )}
                  {client?.name || '-'}
                </S.MetadataValue>
              </S.MetadataColumn>

              <S.TagsContainer>
                {job.archived ? (
                  <S.Tag color="#9E9E9E">Archived</S.Tag>
                ) : (
                  <S.Tag color="#2196F3">Active</S.Tag>
                )}
              </S.TagsContainer>
            </S.MetadataRow>
          </S.JobOverviewCard>

          {/* Section 2: Workflow Stages */}
          <S.WorkflowCard>
            <S.WorkflowTitle>Workflow - Events</S.WorkflowTitle>

            <S.StagesContainer>
              <S.StageArrow color="#D5F4E6" textColor="#2E7D4E" active={job.status === 'NEW'}>
                <S.StageText>New</S.StageText>
              </S.StageArrow>

              <S.StageArrow color="#FFEAA7" textColor="#8B6914" active={job.status === 'PENDING'}>
                <S.StageText>Pending</S.StageText>
              </S.StageArrow>

              <S.StageArrow color="#FAD4D8" textColor="#B85C69" active={job.status === 'IN_PROGRESS'}>
                <S.StageText>In Progress</S.StageText>
              </S.StageArrow>

              <S.StageArrow color="#D6EAF8" textColor="#3A5A78" active={job.status === 'COMPLETED'}>
                <S.StageText>Completed</S.StageText>
              </S.StageArrow>
            </S.StagesContainer>
          </S.WorkflowCard>

          {/* Section 3: Job Details with Tabs */}
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
              {/* Client Tab */}
              {activeTab === 'client' && (
                <>
                  <S.DetailsSectionTitle>Client information</S.DetailsSectionTitle>
                  <S.DetailsContent>
                    {client ? (
                      <>
                        <S.DetailRow>
                          <S.DetailLabel>
                            <S.FieldIcon><BusinessIcon fontSize="small" /></S.FieldIcon>
                            Client Name
                          </S.DetailLabel>
                          <S.DetailValue>{client.name || '-'}</S.DetailValue>
                        </S.DetailRow>

                        <S.DetailRow>
                          <S.DetailLabel>
                            <S.FieldIcon><EmailIcon fontSize="small" /></S.FieldIcon>
                            Email
                          </S.DetailLabel>
                          <S.DetailValue>{client.email || '-'}</S.DetailValue>
                        </S.DetailRow>

                        <S.DetailRow>
                          <S.DetailLabel>
                            <S.FieldIcon><PhoneIcon fontSize="small" /></S.FieldIcon>
                            Telephone
                          </S.DetailLabel>
                          <S.DetailValue>{client.telephone || '-'}</S.DetailValue>
                        </S.DetailRow>

                        <S.DetailRow>
                          <S.DetailLabel>
                            <S.FieldIcon><PhoneAndroidIcon fontSize="small" /></S.FieldIcon>
                            Mobile
                          </S.DetailLabel>
                          <S.DetailValue>{client.mobile || '-'}</S.DetailValue>
                        </S.DetailRow>

                        <S.DetailRow>
                          <S.DetailLabel>
                            <S.FieldIcon><LocationOnIcon fontSize="small" /></S.FieldIcon>
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
              )}

              {/* Worker Tab */}
              {activeTab === 'worker' && (
                <>
                  <S.DetailsSectionTitle>Worker information</S.DetailsSectionTitle>
                  <S.DetailsContent>
                    {worker ? (
                      <>
                        <S.DetailRow>
                          <S.DetailLabel>
                            <S.FieldIcon><PersonIcon fontSize="small" /></S.FieldIcon>
                            Worker Name
                          </S.DetailLabel>
                          <S.DetailValue>{worker.name || '-'}</S.DetailValue>
                        </S.DetailRow>

                        <S.DetailRow>
                          <S.DetailLabel>
                            <S.FieldIcon><EmailIcon fontSize="small" /></S.FieldIcon>
                            Email
                          </S.DetailLabel>
                          <S.DetailValue>{worker.email || '-'}</S.DetailValue>
                        </S.DetailRow>

                        <S.DetailRow>
                          <S.DetailLabel>
                            <S.FieldIcon><PhoneIcon fontSize="small" /></S.FieldIcon>
                            Telephone
                          </S.DetailLabel>
                          <S.DetailValue>{worker.telephone || '-'}</S.DetailValue>
                        </S.DetailRow>

                        <S.DetailRow>
                          <S.DetailLabel>
                            <S.FieldIcon><PhoneAndroidIcon fontSize="small" /></S.FieldIcon>
                            Mobile
                          </S.DetailLabel>
                          <S.DetailValue>{worker.mobile || '-'}</S.DetailValue>
                        </S.DetailRow>

                        <S.DetailRow>
                          <S.DetailLabel>
                            <S.FieldIcon><BadgeIcon fontSize="small" /></S.FieldIcon>
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
              )}

              {/* Template Tab */}
              {activeTab === 'template' && (
                <>
                  <S.DetailsSectionTitle>Template information</S.DetailsSectionTitle>
                  <S.DetailsContent>
                    {template ? (
                      <>
                        <S.DetailRow>
                          <S.DetailLabel>
                            <S.FieldIcon><CategoryIcon fontSize="small" /></S.FieldIcon>
                            Template Name
                          </S.DetailLabel>
                          <S.DetailValue>{template.name || '-'}</S.DetailValue>
                        </S.DetailRow>

                        {template.description && (
                          <S.DetailRow>
                            <S.DetailLabel>
                              <S.FieldIcon><DescriptionIcon fontSize="small" /></S.FieldIcon>
                              Description
                            </S.DetailLabel>
                            <S.DetailValue>{template.description}</S.DetailValue>
                          </S.DetailRow>
                        )}

                        <S.DetailRow>
                          <S.DetailLabel>
                            <S.FieldIcon><CategoryIcon fontSize="small" /></S.FieldIcon>
                            Default Template
                          </S.DetailLabel>
                          <S.DetailValue>{template.default ? 'Yes' : 'No'}</S.DetailValue>
                        </S.DetailRow>

                        <S.DetailRow>
                          <S.DetailLabel>
                            <S.FieldIcon><CalendarTodayIcon fontSize="small" /></S.FieldIcon>
                            Created At
                          </S.DetailLabel>
                          <S.DetailValue>{formatDate(template.createdAt)}</S.DetailValue>
                        </S.DetailRow>

                        <S.DetailRow>
                          <S.DetailLabel>
                            <S.FieldIcon><CalendarTodayIcon fontSize="small" /></S.FieldIcon>
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
              )}

              {/* Custom Fields Tab */}
              {activeTab === 'customFields' && (
                <>
                  <S.DetailsSectionTitle>Custom field values</S.DetailsSectionTitle>
                  <S.DetailsContent>
                    {job.fieldValues && Object.keys(job.fieldValues).length > 0 ? (
                      <>
                        {/* Use template fields to determine required vs optional */}
                        {(() => {
                          // Create a map of field IDs to template field definitions
                          const fieldDefinitionMap = new Map<string, JobTemplateFieldResponse>();
                          templateFields.forEach(field => {
                            if (field.id) {
                              fieldDefinitionMap.set(String(field.id), field);
                            }
                          });

                          const requiredFields = Object.entries(job.fieldValues).filter(([key, _]) => {
                            const fieldDef = fieldDefinitionMap.get(key);
                            return fieldDef && fieldDef.required === true;
                          });

                          const optionalFields = Object.entries(job.fieldValues).filter(([key, _]) => {
                            const fieldDef = fieldDefinitionMap.get(key);
                            return !fieldDef || fieldDef.required !== true;
                          });

                          return (
                            <>
                              {/* Required Fields Section */}
                              {requiredFields.length > 0 && (
                                <>
                                  <S.FieldsGroupTitle>Required Fields</S.FieldsGroupTitle>
                                  {requiredFields.map(([key, fieldValueResponse]) => {
                                    const fieldDef = fieldDefinitionMap.get(key);
                                    const value =
                                      fieldValueResponse && typeof fieldValueResponse === 'object' && 'value' in fieldValueResponse
                                        ? String(fieldValueResponse.value || '-')
                                        : String(fieldValueResponse || '-');

                                    const label = fieldDef?.label || key;
                                    const fieldType = fieldDef?.jobFieldType || 'TEXT';

                                    return (
                                      <S.DetailRow key={key}>
                                        <S.DetailLabel>
                                          <S.RequiredIndicator>*</S.RequiredIndicator>
                                          {label}
                                          <S.FieldTypeLabel>({fieldType})</S.FieldTypeLabel>
                                        </S.DetailLabel>
                                        <S.DetailValue>{value}</S.DetailValue>
                                      </S.DetailRow>
                                    );
                                  })}
                                </>
                              )}

                              {/* Optional Fields Section */}
                              {optionalFields.length > 0 && (
                                <>
                                  {requiredFields.length > 0 && (
                                    <S.FieldsGroupTitle style={{ marginTop: '24px' }}>
                                      Optional Fields
                                    </S.FieldsGroupTitle>
                                  )}
                                  {optionalFields.map(([key, fieldValueResponse]) => {
                                    const fieldDef = fieldDefinitionMap.get(key);
                                    const value =
                                      fieldValueResponse && typeof fieldValueResponse === 'object' && 'value' in fieldValueResponse
                                        ? String(fieldValueResponse.value || '-')
                                        : String(fieldValueResponse || '-');

                                    const label = fieldDef?.label || key;
                                    const fieldType = fieldDef?.jobFieldType || 'TEXT';

                                    return (
                                      <S.DetailRow key={key}>
                                        <S.DetailLabel>
                                          {label}
                                          <S.FieldTypeLabel>({fieldType})</S.FieldTypeLabel>
                                        </S.DetailLabel>
                                        <S.DetailValue>{value}</S.DetailValue>
                                      </S.DetailRow>
                                    );
                                  })}
                                </>
                              )}
                            </>
                          );
                        })()}
                      </>
                    ) : (
                      <S.PlaceholderText>No custom fields defined for this job</S.PlaceholderText>
                    )}
                  </S.DetailsContent>
                </>
              )}

              {/* Assets Tab */}
              {activeTab === 'assets' && (
                <>
                  <S.DetailsSectionTitle>Assets</S.DetailsSectionTitle>
                  <S.DetailsContent>
                    {job.assetIds && job.assetIds.length > 0 ? (
                      <>
                        <S.DetailRow>
                          <S.DetailLabel>
                            <S.FieldIcon><InventoryIcon fontSize="small" /></S.FieldIcon>
                            Total Assets
                          </S.DetailLabel>
                          <S.DetailValue>{job.assetIds.length}</S.DetailValue>
                        </S.DetailRow>
                        <S.DetailRow>
                          <S.DetailLabel>
                            <S.FieldIcon><FingerprintIcon fontSize="small" /></S.FieldIcon>
                            Asset IDs
                          </S.DetailLabel>
                          <S.DetailValue>{job.assetIds.join(', ')}</S.DetailValue>
                        </S.DetailRow>
                      </>
                    ) : (
                      <S.PlaceholderText>No assets linked to this job</S.PlaceholderText>
                    )}
                  </S.DetailsContent>
                </>
              )}

              {/* Job Info Tab */}
              {activeTab === 'info' && (
                <>
                  <S.DetailsSectionTitle>Job information</S.DetailsSectionTitle>
                  <S.DetailsContent>
                    <S.DetailRow>
                      <S.DetailLabel>
                        <S.FieldIcon><FingerprintIcon fontSize="small" /></S.FieldIcon>
                        Job ID
                      </S.DetailLabel>
                      <S.DetailValue>{job.id}</S.DetailValue>
                    </S.DetailRow>

                    <S.DetailRow>
                      <S.DetailLabel>
                        <S.FieldIcon><CategoryIcon fontSize="small" /></S.FieldIcon>
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
                        <S.FieldIcon><CalendarTodayIcon fontSize="small" /></S.FieldIcon>
                        Created At
                      </S.DetailLabel>
                      <S.DetailValue>{formatDate(job.createdAt)}</S.DetailValue>
                    </S.DetailRow>

                    <S.DetailRow>
                      <S.DetailLabel>
                        <S.FieldIcon><CalendarTodayIcon fontSize="small" /></S.FieldIcon>
                        Updated At
                      </S.DetailLabel>
                      <S.DetailValue>{formatDate(job.updatedAt)}</S.DetailValue>
                    </S.DetailRow>

                    <S.DetailRow>
                      <S.DetailLabel>
                        <S.FieldIcon><CategoryIcon fontSize="small" /></S.FieldIcon>
                        Archived
                      </S.DetailLabel>
                      <S.DetailValue>{job.archived ? 'Yes' : 'No'}</S.DetailValue>
                    </S.DetailRow>
                  </S.DetailsContent>
                </>
              )}
            </S.TabContent>
          </S.DetailsSection>
        </S.DetailsGrid>
      </S.ContentContainer>
    </PageWrapper>
  );
};

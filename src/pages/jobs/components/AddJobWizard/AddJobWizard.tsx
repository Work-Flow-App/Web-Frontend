import React, { useState, useEffect } from 'react';
import { Box, Stepper, Step, StepLabel } from '@mui/material';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';
import { jobService } from '../../../../services/api';
import { Loader } from '../../../../components/UI';
import { Step1TemplateCustomer } from './steps/Step1TemplateCustomer';
import { Step2Client } from './steps/Step2Client';
import { Step3AssignDetails } from './steps/Step3AssignDetails';
import { Step4CustomFields } from './steps/Step4CustomFields';

export interface WizardData {
  templateId?: number;
  customerId?: number;
  newCustomerData?: {
    name: string;
    email?: string;
    telephone?: string;
    mobile?: string;
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  clientId?: number;
  newClientData?: {
    name: string;
    email?: string;
    telephone?: string;
    mobile?: string;
    address?: string;
  };
  assignedWorkerId?: number;
  workflowId?: number;
  assetIds?: number[];
  fieldValues?: { [key: string]: string | number | boolean };
  address?: {
    fullAddress: string;
    latitude?: number;
    longitude?: number;
  };
}

const WIZARD_STEPS = ['Template & Customer', 'Client', 'Assign Details', 'Custom Fields'];

interface AddJobWizardProps {
  onSuccess?: () => void;
  jobId?: number;
}

export const AddJobWizard: React.FC<AddJobWizardProps> = ({ onSuccess, jobId }) => {
  const { activeScreen } = useGlobalModalInnerContext();
  const [wizardData, setWizardData] = useState<WizardData>({});
  const [originalAssetIds, setOriginalAssetIds] = useState<number[]>([]);
  const [loadingJob, setLoadingJob] = useState(!!jobId);

  useEffect(() => {
    if (!jobId) return;
    setLoadingJob(true);
    jobService.getJobById(jobId)
      .then((res) => {
        const job = res.data;
        const fieldValues: { [key: string]: string | number | boolean } = {};
        if (job.fieldValues) {
          Object.entries(job.fieldValues).forEach(([key, fv]) => {
            if (fv && typeof fv === 'object' && 'value' in fv) {
              fieldValues[key] = fv.value as string | number | boolean;
            }
          });
        }
        const loadedAssetIds = job.assetIds ?? [];
        setOriginalAssetIds(loadedAssetIds);
        setWizardData({
          templateId: job.templateId,
          customerId: job.customerId,
          clientId: job.clientId,
          assignedWorkerId: job.assignedWorkerId,
          workflowId: job.workflowId,
          assetIds: loadedAssetIds,
          fieldValues,
          address: job.address
            ? {
                fullAddress: [job.address.street, job.address.city, job.address.state, job.address.postalCode, job.address.country]
                  .filter(Boolean)
                  .join(', '),
                latitude: job.address.latitude,
                longitude: job.address.longitude,
              }
            : undefined,
        });
      })
      .finally(() => setLoadingJob(false));
  }, [jobId]);

  const onStepComplete = (data: Partial<WizardData>) => {
    setWizardData((prev) => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    if (activeScreen === 0) {
      return <Step1TemplateCustomer onStepComplete={onStepComplete} initialData={wizardData} />;
    }
    if (activeScreen === 1) {
      return <Step2Client onStepComplete={onStepComplete} initialData={wizardData} />;
    }
    if (activeScreen === 2) {
      return <Step3AssignDetails onStepComplete={onStepComplete} initialData={wizardData} />;
    }
    return <Step4CustomFields wizardData={wizardData} onSuccess={onSuccess} jobId={jobId} originalAssetIds={originalAssetIds} />;
  };

  if (loadingJob) return <Loader size={40} centered minHeight="380px" />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
      <Stepper activeStep={activeScreen} alternativeLabel>
        {WIZARD_STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ minHeight: 380 }}>
        {renderStep()}
      </Box>
    </Box>
  );
};

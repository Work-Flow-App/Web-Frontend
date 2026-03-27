import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel } from '@mui/material';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';
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
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

const WIZARD_STEPS = ['Template & Customer', 'Client', 'Assign Details', 'Custom Fields'];

interface AddJobWizardProps {
  onSuccess?: () => void;
}

export const AddJobWizard: React.FC<AddJobWizardProps> = ({ onSuccess }) => {
  const { activeScreen } = useGlobalModalInnerContext();
  const [wizardData, setWizardData] = useState<WizardData>({});

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
    return <Step4CustomFields wizardData={wizardData} onSuccess={onSuccess} />;
  };

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

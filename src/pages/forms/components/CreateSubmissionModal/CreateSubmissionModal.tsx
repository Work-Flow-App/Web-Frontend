import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Box } from '@mui/material';
import { Dropdown } from '../../../../components/UI/Forms/Dropdown';
import { Input } from '../../../../components/UI/Forms/Input';
import { FormField } from '../../../../components/UI/FormComponents';
import { Loader } from '../../../../components/UI';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { formService, workerService } from '../../../../services/api';
import type { FormTemplateRequest, WorkerResponse, FormSubmissionResponse } from '../../../../services/api';

export interface CreateSubmissionModalProps {
  onSuccess?: (submission: FormSubmissionResponse) => void;
}

export const CreateSubmissionModal: React.FC<CreateSubmissionModalProps> = ({ onSuccess }) => {
  const methods = useForm();
  const { showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnConfirm, setSkipResetModal } = useGlobalModalInnerContext();

  const [templates, setTemplates] = useState<FormTemplateRequest[]>([]);
  const [workers, setWorkers] = useState<WorkerResponse[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [templatesRes, workersRes] = await Promise.all([formService.getAllTemplates(), workerService.getAllWorkers()]);
        setTemplates((Array.isArray(templatesRes.data) ? templatesRes.data : []).filter((t) => !t.archived));
        setWorkers(Array.isArray(workersRes.data) ? workersRes.data : []);
      } catch (error) {
        showError(extractErrorMessage(error, 'Failed to load templates and workers'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showError]);

  useEffect(() => {
    methods.setValue('templateId', selectedTemplateId != null ? selectedTemplateId.toString() : null);
  }, [selectedTemplateId, methods]);

  useEffect(() => {
    methods.setValue('workerId', selectedWorkerId != null ? selectedWorkerId.toString() : null);
  }, [selectedWorkerId, methods]);

  const stateRef = useRef({ selectedTemplateId, selectedWorkerId, title, templates, onSuccess });
  useEffect(() => {
    stateRef.current = { selectedTemplateId, selectedWorkerId, title, templates, onSuccess };
  }, [selectedTemplateId, selectedWorkerId, title, templates, onSuccess]);

  useEffect(() => {
    updateModalTitle('Create Form Submission');
    updateGlobalModalInnerConfig({
      confirmModalButtonText: submitting ? 'Creating...' : 'Create Submission',
      isConfirmDisabled: submitting,
    });
    setSkipResetModal?.(true);
  }, [updateModalTitle, updateGlobalModalInnerConfig, setSkipResetModal, submitting]);

  useEffect(() => {
    updateOnConfirm(async () => {
      const { selectedTemplateId, selectedWorkerId, title, templates, onSuccess } = stateRef.current;
      if (!selectedTemplateId) {
        showError('Please select a form template');
        return;
      }
      try {
        setSubmitting(true);
        const template = templates.find((t) => t.id === selectedTemplateId);
        const response = await formService.createDraft({
          templateId: selectedTemplateId,
          title: title || template?.name,
          workerId: selectedWorkerId ?? undefined,
        });
        onSuccess?.(response.data);
      } catch (error) {
        showError(extractErrorMessage(error, 'Failed to create submission'));
      } finally {
        setSubmitting(false);
      }
    });
  }, [updateOnConfirm, showError]);

  const templateOptions = useMemo(
    () => templates.map((t) => ({ label: t.name || `Template #${t.id}`, value: (t.id ?? 0).toString() })),
    [templates]
  );

  const workerOptions = useMemo(
    () => workers.map((w) => ({ label: w.name || `Worker #${w.id}`, value: (w.id ?? 0).toString() })),
    [workers]
  );

  if (loading) return <Loader />;

  return (
    <FormProvider {...methods}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormField label="Form Template" required>
          <Dropdown
            name="templateId"
            preFetchedOptions={templateOptions}
            placeHolder="Select a template"
            value={selectedTemplateId ? selectedTemplateId.toString() : undefined}
            onChange={(value) => setSelectedTemplateId(value ? parseInt(value as string) : null)}
            disablePortal
            fullWidth
            disabled={submitting}
          />
        </FormField>

        <FormField label="Title (Optional)">
          <Input
            name="title"
            placeholder="Defaults to the template name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            hideErrorMessage
            disabled={submitting}
          />
        </FormField>

        <FormField label="Send to Worker (Optional)">
          <Dropdown
            name="workerId"
            preFetchedOptions={workerOptions}
            placeHolder="Assign a worker now, or later"
            value={selectedWorkerId ? selectedWorkerId.toString() : undefined}
            onChange={(value) => setSelectedWorkerId(value ? parseInt(value as string) : null)}
            disablePortal
            fullWidth
            disabled={submitting}
          />
        </FormField>
      </Box>
    </FormProvider>
  );
};

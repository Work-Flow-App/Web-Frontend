import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import { LeaveRequestFormSchema, type LeaveRequestFormData } from '../../schema/LeaveRequestFormSchema';
import { SetupFormWrapper } from '../../../../components/UI/SetupFormWrapper';
import { LeaveRequestFormFields } from '../LeaveRequestFormFields';
import { useSchema } from '../../../../utils/validation';
import {
  leaveService,
  LeaveType,
  type LeaveRequestResponse,
} from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';

export interface LeaveRequestFormProps {
  isModal?: boolean;
  /** Existing PENDING request to edit; absent when submitting a new request */
  leaveRequest?: LeaveRequestResponse;
  onSuccess?: () => void;
}

const extractDropdownValue = (value: LeaveRequestFormData['type']): LeaveType =>
  (typeof value === 'object' ? value.value : value) as LeaveType;

export const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  isModal = false,
  leaveRequest,
  onSuccess,
}) => {
  const isEdit = !!leaveRequest;
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig } = useGlobalModalInnerContext();
  const { fieldRules, defaultValues: schemaDefaults } = useSchema(LeaveRequestFormSchema);

  // Own form instance (rather than letting SetupFormWrapper create one) so we can
  // set an inline field error when the server returns a 409 overlap conflict.
  const methods = useForm<LeaveRequestFormData>({
    // @ts-expect-error - Yup resolver type compatibility, same as SetupFormWrapper's internal usage
    resolver: yupResolver(fieldRules),
    defaultValues: leaveRequest
      ? {
          type: leaveRequest.type,
          startDate: leaveRequest.startDate,
          endDate: leaveRequest.endDate,
          reason: leaveRequest.reason || '',
        }
      : schemaDefaults,
    mode: 'onChange',
  });

  useEffect(() => {
    if (isModal) {
      updateModalTitle(isEdit ? 'Edit Leave Request' : 'Request Leave');
      updateGlobalModalInnerConfig({
        confirmModalButtonText: isEdit ? 'Save Changes' : 'Submit Request',
      });
    }
  }, [isModal, isEdit, updateModalTitle, updateGlobalModalInnerConfig]);

  const handleSubmit = useCallback(
    async (data: LeaveRequestFormData) => {
      const payload = {
        type: extractDropdownValue(data.type),
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason || undefined,
      };

      try {
        if (isEdit && leaveRequest) {
          await leaveService.updateLeaveRequest(leaveRequest.id, payload);
          showSuccess('Leave request updated');
        } else {
          await leaveService.submitLeaveRequest(payload);
          showSuccess('Leave request submitted');
        }
        onSuccess?.();
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 409) {
          methods.setError('startDate', {
            type: 'manual',
            message: error.response.data?.message || 'You already have a leave request for these dates',
          });
          return;
        }
        showError(extractErrorMessage(error, `Failed to ${isEdit ? 'update' : 'submit'} leave request`));
        throw error;
      }
      return { success: true };
    },
    [isEdit, leaveRequest, methods, showSuccess, showError, onSuccess]
  );

  return (
    <SetupFormWrapper
      schema={LeaveRequestFormSchema}
      // @ts-expect-error - Yup resolver type compatibility, same as SetupFormWrapper's internal usage
      formMethods={methods}
      onSubmit={handleSubmit}
      isModal={isModal}
    >
      <LeaveRequestFormFields />
    </SetupFormWrapper>
  );
};

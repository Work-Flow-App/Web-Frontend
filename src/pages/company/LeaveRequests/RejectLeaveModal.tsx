import React, { useEffect } from 'react';
import { RejectLeaveFormSchema, type RejectLeaveFormData } from './RejectLeaveFormSchema';
import { SetupFormWrapper } from '../../../components/UI/SetupFormWrapper';
import { TextArea } from '../../../components/UI/Forms/TextArea';
import { FormField } from '../../../components/UI/FormComponents';
import { useSchema } from '../../../utils/validation';
import { useGlobalModalInnerContext } from '../../../components/UI/GlobalModal/context';
import * as S from './RejectLeaveModal.styles';

export interface RejectLeaveModalProps {
  workerName: string;
  onConfirm: (decisionNote: string) => void;
}

const RejectLeaveFormFields: React.FC = () => {
  const { placeHolders, fieldLabels, fieldTitles, isRequireds } = useSchema(RejectLeaveFormSchema);

  return (
    <FormField label={fieldLabels.decisionNote} required={isRequireds.decisionNote}>
      <TextArea
        name={fieldTitles.decisionNote}
        placeholder={placeHolders.decisionNote}
        rows={3}
        hideErrorMessage={false}
      />
    </FormField>
  );
};

export const RejectLeaveModal: React.FC<RejectLeaveModalProps> = ({ workerName, onConfirm }) => {
  const { updateModalTitle, updateGlobalModalInnerConfig } = useGlobalModalInnerContext();

  useEffect(() => {
    updateModalTitle('Reject Leave Request');
    updateGlobalModalInnerConfig({
      confirmModalButtonText: 'Reject Request',
      confirmButtonColor: 'error',
    });
  }, [updateModalTitle, updateGlobalModalInnerConfig]);

  const handleSubmit = async (data: RejectLeaveFormData) => {
    onConfirm(data.decisionNote.trim());
    return { success: true };
  };

  return (
    <SetupFormWrapper schema={RejectLeaveFormSchema} onSubmit={handleSubmit} isModal>
      <S.IntroText variant="body2">
        Reject the leave request from <strong>{workerName}</strong>. A reason is required.
      </S.IntroText>
      <RejectLeaveFormFields />
    </SetupFormWrapper>
  );
};

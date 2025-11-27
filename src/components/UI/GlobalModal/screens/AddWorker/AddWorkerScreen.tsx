import { useEffect } from 'react';
import { useGlobalModalInnerContext } from '../../context';
import type { AddWorkerScreenProps, AddWorkerFormData } from './AddWorkerScreen.types';
import { AddWorkerFormSchema } from './AddWorkerSchema';
import { SetupFormWrapper } from '../../../SetupFormWrapper';
import { useSchema } from '../../../../../utils/validation';
import { Input } from '../../../Forms/Input';
import { PasswordInput } from '../../../Forms/PasswordInput';
import * as S from './AddWorkerScreen.styled';

export const AddWorkerScreen = (props: AddWorkerScreenProps) => {
  const { onInvite } = props;

  // Generate schema using the utility
  const { placeHolders, fieldLabels } = useSchema(AddWorkerFormSchema);

  // Global Modal Inner Context
  const { updateModalTitle, updateGlobalModalInnerConfig, setSkipResetModal } =
    useGlobalModalInnerContext();

  useEffect(() => {
    // Set modal configuration
    updateModalTitle('Add Worker');

    updateGlobalModalInnerConfig({
      confirmModalButtonText: 'Add Worker',
      cancelButtonText: 'Cancel',
      confirmButtonOnly: false,
    });

    // Set skip reset to false so modal auto-closes on success
    setSkipResetModal?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Form submission handler
  const handleSubmit = async (data: AddWorkerFormData) => {
    if (onInvite) {
      await onInvite(data);
    }
    return { success: true };
  };

  return (
    <SetupFormWrapper
      schema={AddWorkerFormSchema}
      onSubmit={handleSubmit}
      successMessage="Worker added successfully"
      errorMessage="Failed to add worker. Please try again."
      isModal={true}
    >
      <S.FormWrapper>
        <S.FieldWrapper>
          <Input
            name="name"
            label={fieldLabels.name}
            placeholder={placeHolders.name}
            fullWidth
          />
        </S.FieldWrapper>

        <S.FieldRow>
          <Input
            name="initials"
            label={fieldLabels.initials}
            placeholder={placeHolders.initials}
            fullWidth
          />
          <Input
            name="email"
            label={fieldLabels.email}
            placeholder={placeHolders.email}
            fullWidth
          />
        </S.FieldRow>

        <S.FieldRow>
          <Input
            name="telephone"
            label={fieldLabels.telephone}
            placeholder={placeHolders.telephone}
            fullWidth
          />
          <Input
            name="mobile"
            label={fieldLabels.mobile}
            placeholder={placeHolders.mobile}
            fullWidth
          />
        </S.FieldRow>

        <S.FieldRow>
          <Input
            name="username"
            label={fieldLabels.username}
            placeholder={placeHolders.username}
            fullWidth
          />
          <PasswordInput
            name="password"
            label={fieldLabels.password}
            placeholder={placeHolders.password}
            fullWidth
          />
        </S.FieldRow>
      </S.FormWrapper>
    </SetupFormWrapper>
  );
};

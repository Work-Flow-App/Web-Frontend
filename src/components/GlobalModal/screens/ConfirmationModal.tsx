import { useEffect } from 'react';
import { useGlobalModalInnerContext } from '../context';
import { ModalContainer, MessageText, DescriptionText } from './ConfirmationModal.style';
import type { ConfirmationModalProps } from './IConfirmationModal';
import { CONFIRMATION_MODAL_DEFAULTS } from '../Utils/GlobalConst';

export const ConfirmationModal = ({
  title = CONFIRMATION_MODAL_DEFAULTS.title,
  message,
  confirmButtonText = CONFIRMATION_MODAL_DEFAULTS.confirmButtonText,
  cancelButtonText = CONFIRMATION_MODAL_DEFAULTS.cancelButtonText,
  onConfirm,
  onCancel,
  description,
  variant = CONFIRMATION_MODAL_DEFAULTS.variant,
}: ConfirmationModalProps) => {
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnClose, updateOnConfirm } =
    useGlobalModalInnerContext();

  useEffect(() => {
    updateModalTitle(title);
    updateGlobalModalInnerConfig({
      confirmModalButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
    });
    updateOnClose(() => {
      onCancel?.();
    });
    updateOnConfirm(() => {
      onConfirm();
    });
  }, [
    title,
    confirmButtonText,
    cancelButtonText,
    onConfirm,
    onCancel,
    updateModalTitle,
    updateGlobalModalInnerConfig,
    updateOnClose,
    updateOnConfirm,
  ]);

  return (
    <ModalContainer>
      <MessageText variant="body1" colorVariant={variant} hasDescription={!!description}>
        {message}
      </MessageText>
      {description && <DescriptionText variant="body2">{description}</DescriptionText>}
    </ModalContainer>
  );
};

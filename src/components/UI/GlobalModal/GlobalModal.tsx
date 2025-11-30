import * as S from './GlobalModal.styled';
import { Suspense } from 'react';
import type { IGlobalModal } from './IGlobalModal';
import { GlobalModalInnerContextProvider, useGlobalModalOuterContext, useGlobalModalInnerContext } from './context';
import { CircularProgress, Box } from '@mui/material';
import { Button } from '../Button';

const PageLoader = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
    <CircularProgress />
  </Box>
);

export const BaseGlobalModal = (props: IGlobalModal) => {
  // Children that is passed from the Global Model
  const { children } = props;

  // Global Modal State context from pageWrapper
  const { resetGlobalModalOuterProps } = useGlobalModalOuterContext();

  // Global Modal Inner State
  const {
    globalModalInnerConfig: {
      hideFooter,
      confirmButtonOnly,
      confirmModalButtonText,
      cancelButtonOnly,
      cancelButtonText,
    },
    modalTitle,
    activeScreen,
    resetActiveScreen,
    updateActiveScreen,
    onClose,
    onConfirm,
    headerActionButton,
    skipResetModal,
  } = useGlobalModalInnerContext();

  const isFirstScreen = activeScreen === 0;
  const modalTitleClass = !isFirstScreen ? 'alignCenter' : '';

  // Call Back Handlers
  const handleBackButtonClick = () => {
    updateActiveScreen(activeScreen - 1);
  };

  const resetModal = () => {
    resetActiveScreen();
    resetGlobalModalOuterProps();
  };

  const handleConfirmButtonClick = () => {
    onConfirm?.();
    if (!skipResetModal) {
      resetModal();
    }
  };

  const handleCancelButtonClick = () => {
    onClose?.();
    if (!skipResetModal) {
      resetModal();
    }
  };

  const ModalBodyClassName = 'globalModalBody';

  return (
    <S.ModalContentWrapper>
      <S.ModalHeaderWrapper>
        <S.ModalHeaderContent>
          {!isFirstScreen && (
            <S.ModalBackWrapper onClick={handleBackButtonClick}>
              <S.ModalBackIcon />
              <S.ModalBackText>Back</S.ModalBackText>
            </S.ModalBackWrapper>
          )}
          <S.ModalTitle className={modalTitleClass}>{modalTitle}</S.ModalTitle>

          {!!headerActionButton && <S.ModalHeaderButton>{headerActionButton}</S.ModalHeaderButton>}
        </S.ModalHeaderContent>
      </S.ModalHeaderWrapper>
      <S.ModalBody className={ModalBodyClassName}>{children}</S.ModalBody>
      {!hideFooter && (
        <S.ModalFooterWrapper>
          {confirmButtonOnly ? (
            <Button variant="contained" color="primary" onClick={handleConfirmButtonClick}>
              {confirmModalButtonText || 'Invite'}
            </Button>
          ) : cancelButtonOnly ? (
            <Button variant="outlined" color="secondary" onClick={handleCancelButtonClick}>
              {cancelButtonText || 'Cancel'}
            </Button>
          ) : (
            <>
              <Button variant="outlined" color="secondary" onClick={handleCancelButtonClick}>
                {cancelButtonText || 'Cancel'}
              </Button>
              <Button variant="contained" color="primary" onClick={handleConfirmButtonClick}>
                {confirmModalButtonText || 'Invite'}
              </Button>
            </>
          )}
        </S.ModalFooterWrapper>
      )}
    </S.ModalContentWrapper>
  );
};

export const GlobalModal = () => {
  // Global Modal State context from pageWrapper
  const { globalModalOuterProps } = useGlobalModalOuterContext();

  if (!globalModalOuterProps.isOpen) return <></>;

  try {
    return (
      <>
        <S.ModalOverlay />
        <GlobalModalInnerContextProvider>
          <S.ModalContainerWrapper size={globalModalOuterProps.size}>
            <Suspense fallback={<PageLoader />}>
              <BaseGlobalModal>{globalModalOuterProps.children}</BaseGlobalModal>
            </Suspense>
          </S.ModalContainerWrapper>
        </GlobalModalInnerContextProvider>
      </>
    );
  } catch (error) {
    console.error('Error rendering GlobalModal:', error);
    return <></>;
  }
};

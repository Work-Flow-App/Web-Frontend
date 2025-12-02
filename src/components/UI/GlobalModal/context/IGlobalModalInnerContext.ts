import { ReactNode } from 'react';

export interface IGlobalModalInnerContextProvider {
  /**
   * The children of the context component
   */
  children: ReactNode;
}

export interface IGlobalModalInnerContextConfigProps {
  /**
   * The text of the confirm button of the modal
   */
  confirmModalButtonText?: string;

  /**
   * The text of the cancel button of the modal
   */
  cancelButtonText?: string;

  /**
   * Whether to show only one button or not
   */
  confirmButtonOnly?: boolean;

  /**
   * Whether to show only one button or not
   */
  cancelButtonOnly?: boolean;

  /**
   * on confirm call back
   */
  onConfirm?: () => void;

  /**
   * The header action button on right side
   */
  headerActionButton?: ReactNode;

  /**
   * The header action button on right side
   */
  hideFooter?: boolean;

  /**
   * Whether the confirm button should be disabled
   */
  isConfirmDisabled?: boolean;
}

export interface IGlobalModalInnerContentState {
  /**
   * The state of the active tab inside the modal
   */
  activeScreen: number;

  /**
   * The update callback to update the ActiveScreen
   */
  updateActiveScreen: (state: number) => void;

  /**
   * The title of the modal
   */
  modalTitle: string;

  /**
   * The update callback to update the activeTab
   */
  updateModalTitle: (title: string) => void;

  /**
   * The global modal content initialization details
   */
  globalModalInnerConfig: IGlobalModalInnerContextConfigProps;

  /**
   * The update callback to update the modal content details
   */
  updateGlobalModalInnerConfig: (sItem: IGlobalModalInnerContextConfigProps) => void;

  /**
   * Header action button button component
   */
  headerActionButton?: ReactNode;

  /**
   * The update callback to update the modal header action button
   */
  updateHeaderActionButton: (sElement: ReactNode) => void;

  /**
   * The callback to close the modal
   */
  onClose?: () => void;

  /**
   * The update callback to update the modal on close callBack
   */
  updateOnClose: (callBack: () => void) => void;

  /**
   * The callback to close the snackbar
   */
  onConfirm?: () => void;

  /**
   * The update callback to update the modal on close callBack
   */
  updateOnConfirm: (callBack: () => void) => void;

  /**
   * The callback to reset the modal active screen
   */
  resetActiveScreen: () => void;

  /**
   * Data to pass across all the pages of the modal
   */
  innerModalData?: any;

  /**
   * Update inner modal data callback
   */
  setInnerModalData: (item?: any) => void;

  /**
   * Whether to skip reset modal method
   */
  skipResetModal?: boolean;

  /**
   * This method set the boolean value to show the skip reset functionality
   */
  setSkipResetModal?: (item?: any) => void;
}


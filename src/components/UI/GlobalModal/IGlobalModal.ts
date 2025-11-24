import type { ReactNode } from 'react';
import { ModalSizes } from './enums';

export type IGlobalModal = {
  /**
   * The children of the modal
   */
  children: ReactNode;

  /**
   * The title of the modal
   */
  title?: string;

  /**
   * The size of the modal
   */
  size?: ModalSizes;

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
   * The callback to close the modal
   */
  onClose?: () => void;

  /**
   * The callback to confirm the modal
   */
  onConfirm?: () => void;
}

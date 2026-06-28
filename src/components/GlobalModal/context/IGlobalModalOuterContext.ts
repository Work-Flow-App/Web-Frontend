import type { ReactNode } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { ModalSizes } from '../enums';

export interface IGlobalModalOuterContextProvider {
  children: ReactNode;
}

export interface IGlobalModalOuterProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;

  /**
   * Children of the modal
   */
  children: ReactNode;

  /**
   * Field name for any inputs from the modal
   */
  fieldName: string;

  /**
   * The methods of the parent form
   */
  parentFormMethods?: UseFormReturn<any, any, undefined>;

  /**
   * The schema passed from the parent component
   */
  parentSchema?: any;

  /**
   * The size of the modal
   */
  size?: ModalSizes;

  /**
   * Whether the opened modal in edit mode or not
   */
  isEditMode?: boolean;

  /**
   * Data that needs to pass on the modal
   */
  modalData?: any;

  /**
   * Custom Callbacks that can be passed to modal
   */
  callBacks?: {
    [key: string]: (...args: any[]) => void;
  };
}

export interface IGlobalModalOuterState {
  /**
   * The global modal initialization details
   */
  globalModalOuterProps: IGlobalModalOuterProps;

  /**
   * The update callback to update the modal details
   */
  setGlobalModalOuterProps: (sItem: IGlobalModalOuterProps) => void;

  /**
   * The callback to reset the modal details
   */
  resetGlobalModalOuterProps: () => void;
}

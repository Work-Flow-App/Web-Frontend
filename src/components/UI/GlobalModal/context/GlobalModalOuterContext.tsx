import { createContext, useContext, useState } from 'react';
import type {
  IGlobalModalOuterProps,
  IGlobalModalOuterState,
  IGlobalModalOuterContextProvider,
} from './types';
import { ModalSizes } from '../enums';

const DummyMethod = () => {};

// the context for the global modal
const GlobalModalOuterContext = createContext<IGlobalModalOuterState>({
  globalModalOuterProps: {
    isOpen: false,
    children: '',
    fieldName: '',
    parentFormMethods: undefined,
  },
  setGlobalModalOuterProps: DummyMethod,
  resetGlobalModalOuterProps: DummyMethod,
});

GlobalModalOuterContext.displayName = 'GlobalModalOuterContext';

// The hook to expose the global modal context value
export const useGlobalModalOuterContext = () => {
  return useContext(GlobalModalOuterContext);
};

export const GlobalModalOuterContextProvider = ({ children }: IGlobalModalOuterContextProvider): JSX.Element => {
  const [globalModalOuterProps, setGlobalModalOuterProps] = useState<IGlobalModalOuterProps>({
    isOpen: false,
    children: '',
    fieldName: '',
    parentFormMethods: undefined,
  });

  const handleGlobalModalOuterProps = (globalModalOuterProps: IGlobalModalOuterProps) => {
    setGlobalModalOuterProps({ ...globalModalOuterProps });
  };

  const handleResetGlobalModelOuterProps = () => {
    setGlobalModalOuterProps({
      isOpen: false,
      children: '',
      fieldName: '',
      parentFormMethods: undefined,
      parentSchema: undefined,
      size: ModalSizes.SMALL,
      modalData: null,
      callBacks: undefined,
    });
  };

  return (
    <GlobalModalOuterContext.Provider
      value={{
        globalModalOuterProps,
        setGlobalModalOuterProps: handleGlobalModalOuterProps,
        resetGlobalModalOuterProps: handleResetGlobalModelOuterProps,
      }}>
      {children}
    </GlobalModalOuterContext.Provider>
  );
};

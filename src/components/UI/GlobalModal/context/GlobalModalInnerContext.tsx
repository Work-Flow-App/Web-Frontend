import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  IGlobalModalInnerContentState,
  IGlobalModalInnerContextProvider,
  IGlobalModalInnerContextConfigProps,
} from './types';

const DummyMethod = () => {};

const GlobalModalInnerContext = createContext<IGlobalModalInnerContentState>({
  activeScreen: 0,
  updateActiveScreen: DummyMethod,
  modalTitle: '',
  updateModalTitle: DummyMethod,
  globalModalInnerConfig: {},
  headerActionButton: '',
  updateHeaderActionButton: DummyMethod,
  updateGlobalModalInnerConfig: DummyMethod,
  onClose: DummyMethod,
  updateOnClose: DummyMethod,
  onConfirm: DummyMethod,
  updateOnConfirm: DummyMethod,
  resetActiveScreen: DummyMethod,
  innerModalData: {},
  setInnerModalData: DummyMethod,
});

GlobalModalInnerContext.displayName = 'GlobalModalInnerContext';

// The hook to expose the context value
export const useGlobalModalInnerContext = () => {
  return useContext(GlobalModalInnerContext);
};

// The context provider
export const GlobalModalInnerContextProvider = ({ children }: IGlobalModalInnerContextProvider): JSX.Element => {
  const [activeScreen, updateActiveScreen] = useState<number>(0);
  const [modalTitle, updateModalTitle] = useState<string>('');
  const [globalModalInnerConfig, updateGlobalModalInnerConfig] = useState<IGlobalModalInnerContextConfigProps>({});
  const [headerActionButton, updateHeaderActionButton] = useState<ReactNode>('');
  const [onClose, setOnClose] = useState<() => void>(() => {});
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});
  const [innerModalData, setInnerModalData] = useState<any>({});
  const [skipResetModal, setSkipResetModal] = useState<boolean>(false);

  const updateOnClose = (callBack: () => void) => setOnClose(() => callBack);
  const updateOnConfirm = (callBack: () => void) => setOnConfirm(() => callBack);

  const handleReset = () => {
    updateActiveScreen(0);
  };

  return (
    <GlobalModalInnerContext.Provider
      value={{
        activeScreen,
        updateActiveScreen,
        modalTitle,
        updateModalTitle,
        globalModalInnerConfig,
        updateGlobalModalInnerConfig,
        headerActionButton,
        updateHeaderActionButton,
        onClose,
        updateOnClose,
        onConfirm,
        updateOnConfirm,
        resetActiveScreen: handleReset,
        innerModalData,
        setInnerModalData,
        skipResetModal,
        setSkipResetModal,
      }}>
      {children}
    </GlobalModalInnerContext.Provider>
  );
};

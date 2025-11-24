import { useEffect, useRef, useCallback } from 'react';
import { useGlobalModalOuterContext } from '../UI/GlobalModal/context';
import { ModalSizes } from '../UI/GlobalModal/enums';
import { ConfigurationScreen } from './ConfigurationScreen';

const STORAGE_KEY = 'app_environment_config';

export interface EnvironmentConfig {
  environment: {
    label: string;
    value: string;
  };
}

export const AppConfiguration = () => {
  const { setGlobalModalOuterProps } = useGlobalModalOuterContext();
  const keyPressCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleConfirm = useCallback((config: EnvironmentConfig) => {
    // Get previous configuration
    const prevConfigStr = localStorage.getItem(STORAGE_KEY);
    let prevConfig: EnvironmentConfig | null = null;

    if (prevConfigStr) {
      try {
        prevConfig = JSON.parse(prevConfigStr);
      } catch (e) {
        console.error('Failed to parse previous config:', e);
      }
    }

    // Save new configuration
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));

    // If environment changed, reload the page
    if (!prevConfig || prevConfig.environment.value !== config.environment.value) {
      window.location.reload();
    }
  }, []);

  const openConfigurationModal = useCallback(() => {
    setGlobalModalOuterProps({
      isOpen: true,
      children: <ConfigurationScreen onConfirm={handleConfirm} />,
      fieldName: 'appConfiguration',
      size: ModalSizes.SMALL,
    });
  }, [setGlobalModalOuterProps, handleConfirm]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'c' || event.key === 'C') {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        keyPressCountRef.current += 1;

        if (keyPressCountRef.current === 3) {
          openConfigurationModal();
          keyPressCountRef.current = 0;
        } else {
          timeoutRef.current = setTimeout(() => {
            keyPressCountRef.current = 0;
          }, 3000);
        }
      } else {
        keyPressCountRef.current = 0;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [openConfigurationModal]);

  return null;
};

export default AppConfiguration;

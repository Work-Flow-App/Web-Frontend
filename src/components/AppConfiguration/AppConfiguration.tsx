import { useEffect, useRef, useState } from 'react';
import { ConfigurationModal } from './ConfigurationModal';

const STORAGE_KEY = 'app_environment_config';

export interface EnvironmentConfig {
  environment: {
    label: string;
    value: string;
  };
}

export const AppConfiguration = () => {
  const [showModal, setShowModal] = useState(false);
  const keyPressCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'c' || event.key === 'C') {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      keyPressCountRef.current += 1;

      if (keyPressCountRef.current === 3) {
        setShowModal(true);
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

  const handleConfirm = (config: EnvironmentConfig) => {
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
    } else {
      setShowModal(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    keyPressCountRef.current = 0;
  };

  return (
    <>
      {showModal && (
        <ConfigurationModal
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default AppConfiguration;

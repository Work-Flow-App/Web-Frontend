import { useEffect, useState } from 'react';
import { useGlobalModalInnerContext } from '../UI/GlobalModal/context';
import type { EnvironmentConfig } from './AppConfiguration';
import * as S from './ConfigurationModal.styles';

interface ConfigurationScreenProps {
  onConfirm: (config: EnvironmentConfig) => void;
}

const STORAGE_KEY = 'app_environment_config';

// Get environment URLs from Vite env variables
// In development: BASE_URL is local, PRODUCTION_URL is prod
// In production: BASE_URL is prod, LOCAL_URL is local
const ENVIRONMENT_OPTIONS = [
  {
    label: 'Local',
    value: import.meta.env.VITE_API_LOCAL_URL ||
           (import.meta.env.DEV ? import.meta.env.VITE_API_BASE_URL : 'http://localhost:5173')
  },
  {
    label: 'Production',
    value: import.meta.env.VITE_API_PRODUCTION_URL ||
           (import.meta.env.PROD ? import.meta.env.VITE_API_BASE_URL : 'https://api.dev.workfloow.app')
  },
];

const getStoredConfig = (): EnvironmentConfig => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const config = JSON.parse(stored);
      // Validate that the stored value matches one of our options
      const matchingEnv = ENVIRONMENT_OPTIONS.find(opt => opt.value === config.environment.value);
      if (matchingEnv) {
        return {
          environment: matchingEnv,
        };
      } else {
        // Clear invalid stored config
        console.warn('Stored config has invalid URL, clearing:', config.environment.value);
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to parse stored config:', e);
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  // Default to first option (Local)
  return {
    environment: ENVIRONMENT_OPTIONS[0],
  };
};

export const ConfigurationScreen = ({ onConfirm }: ConfigurationScreenProps) => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<{ label: string; value: string }>(
    getStoredConfig().environment
  );

  const {
    updateModalTitle,
    updateGlobalModalInnerConfig,
    updateOnClose,
    updateOnConfirm,
  } = useGlobalModalInnerContext();

  useEffect(() => {
    updateModalTitle('App Configuration');

    updateGlobalModalInnerConfig({
      confirmModalButtonText: 'Ok',
      cancelButtonText: 'Cancel',
    });

    updateOnClose(() => {
      // Handle cancel
    });

    updateOnConfirm(() => {
      onConfirm({
        environment: selectedEnvironment,
      });
    });
  }, [selectedEnvironment, onConfirm, updateModalTitle, updateGlobalModalInnerConfig, updateOnClose, updateOnConfirm]);

  return (
    <S.ModalBody>
      <S.FormRow>
        <S.Label>
          Environment <S.Required>*</S.Required>
        </S.Label>
        <S.Select
          value={selectedEnvironment.value}
          onChange={(e) => {
            const option = ENVIRONMENT_OPTIONS.find(opt => opt.value === e.target.value);
            if (option) {
              setSelectedEnvironment(option);
            }
          }}
        >
          {ENVIRONMENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </S.Select>
      </S.FormRow>
    </S.ModalBody>
  );
};

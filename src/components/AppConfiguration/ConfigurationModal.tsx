import { useState } from 'react';
import type { EnvironmentConfig } from './AppConfiguration';
import * as S from './ConfigurationModal.styles';

interface ConfigurationModalProps {
  onConfirm: (config: EnvironmentConfig) => void;
  onCancel: () => void;
}

const STORAGE_KEY = 'app_environment_config';

const ENVIRONMENT_OPTIONS = [
  { label: 'Local', value: 'http://localhost:5173' },
  { label: 'Production', value: 'https://api.dev.workfloow.app' },
];

const getStoredConfig = (): EnvironmentConfig => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored config:', e);
    }
  }
  return {
    environment: ENVIRONMENT_OPTIONS[0],
  };
};

export const ConfigurationModal = ({ onConfirm, onCancel }: ConfigurationModalProps) => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<{ label: string; value: string }>(
    getStoredConfig().environment
  );

  const handleConfirm = () => {
    onConfirm({
      environment: selectedEnvironment,
    });
  };

  return (
    <>
      <S.Overlay onClick={onCancel} />
      <S.ModalContainer>
        <S.ModalContent>
          <S.ModalHeader>
            <S.ModalTitle>App Configuration</S.ModalTitle>
          </S.ModalHeader>

          <S.ModalBody>
            <S.FormRow>
              <S.Label>
                Environment <S.Required>*</S.Required>
              </S.Label>
              <S.Select
                value={selectedEnvironment.value}
                onChange={(e) => {
                  const option = ENVIRONMENT_OPTIONS.find((opt) => opt.value === e.target.value);
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

          <S.ModalFooter>
            <S.Button onClick={handleConfirm}>Ok</S.Button>
            <S.Button onClick={onCancel}>Cancel</S.Button>
          </S.ModalFooter>
        </S.ModalContent>
      </S.ModalContainer>
    </>
  );
};

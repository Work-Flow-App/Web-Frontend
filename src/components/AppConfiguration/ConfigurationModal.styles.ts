import styled from '@emotion/styled';
import { floowColors } from '../../theme/colors';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${floowColors.overlay.modal};
  z-index: 9998;
`;

export const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  width: 90%;
  max-width: 500px;
`;

export const ModalContent = styled.div`
  background: ${floowColors.white};
  border-radius: 8px;
  box-shadow: 0 4px 6px ${floowColors.shadow.xl};
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${floowColors.tailwind.gray[200]};
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${floowColors.text.heading};
`;

export const ModalBody = styled.div`
  padding: 24px;
`;

export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${floowColors.text.label};
`;

export const Required = styled.span`
  color: ${floowColors.red.main};
  margin-left: 2px;
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${floowColors.border.input};
  border-radius: 6px;
  font-size: 14px;
  color: ${floowColors.text.heading};
  background-color: ${floowColors.white};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${floowColors.border.inputHover};
  }

  &:focus {
    outline: none;
    border-color: ${floowColors.border.inputFocus};
    box-shadow: 0 0 0 3px ${floowColors.shadow.focus};
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  background-color: ${floowColors.background.footer};
  border-top: 1px solid ${floowColors.tailwind.gray[200]};
  justify-content: flex-end;
`;

export const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${floowColors.form.button.primary};
  color: ${floowColors.white};

  &:hover {
    background-color: ${floowColors.form.button.primaryHover};
  }

  &:active {
    transform: scale(0.98);
  }

  &:last-child {
    background-color: ${floowColors.form.button.secondary};

    &:hover {
      background-color: ${floowColors.form.button.secondaryHover};
    }
  }
`;

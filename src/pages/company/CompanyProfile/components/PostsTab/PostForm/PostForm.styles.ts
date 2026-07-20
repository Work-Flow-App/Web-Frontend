import styled from '@emotion/styled';

export const FormContainer = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export const AttachmentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const AttachmentSectionLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
`;

export const AttachmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const AttachmentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.8125rem;
  color: #374151;
`;

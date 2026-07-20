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

export const FileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const FileName = styled.span`
  font-size: 0.8125rem;
  color: #6b7280;
`;

export const FileError = styled.span`
  font-size: 0.75rem;
  color: #ef4444;
`;

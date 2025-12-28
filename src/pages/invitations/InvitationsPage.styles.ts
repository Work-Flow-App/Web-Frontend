import styled from '@emotion/styled';

export const InvitationsContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding: 0 4px;
`;

export const StatusBadge = styled.span<{ color: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${({ color }) => `${color}20`};
  color: ${({ color }) => color};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

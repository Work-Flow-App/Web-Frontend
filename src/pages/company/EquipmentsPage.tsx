import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { floowColors } from '../../theme/colors';
import { rem } from '../../components/UI/Typography/utility';

/**
 * Page header section
 */
const PageHeader = styled(Box)({
  marginBottom: rem(32),
});

/**
 * Page title
 */
const PageTitle = styled('h1')({
  fontSize: rem(32),
  fontWeight: 700,
  color: floowColors.black,
  marginBottom: rem(8),
  margin: 0,
});

/**
 * Page subtitle
 */
const PageSubtitle = styled('p')({
  fontSize: rem(14),
  color: floowColors.grey[600],
  margin: 0,
});

/**
 * Content box with card styling
 */
const ContentBox = styled(Box)({
  background: floowColors.white,
  borderRadius: rem(12),
  padding: rem(32),
  boxShadow: `0 ${rem(1)} ${rem(3)} rgba(0, 0, 0, 0.08)`,
  border: `${rem(1)} solid ${floowColors.grey[200]}`,
});

/**
 * Equipments Page
 *
 * Page for managing equipments within the company.
 * This page renders within the Layout component.
 *
 * @example
 * ```tsx
 * <Route path="/company/equipments" element={<EquipmentsPage />} />
 * ```
 */
export const EquipmentsPage: React.FC = () => {
  return (
    <Box sx={{ padding: rem(32) }}>
      <PageHeader>
        <PageTitle>Equipments</PageTitle>
        <PageSubtitle>Manage and view all company equipments</PageSubtitle>
      </PageHeader>

      <ContentBox>
        <Box sx={{ textAlign: 'center', minHeight: rem(300), display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <Box sx={{ fontSize: rem(48), marginBottom: rem(16) }}>🔧</Box>
          <Box
            sx={{
              fontSize: rem(24),
              fontWeight: 600,
              color: floowColors.black,
              marginBottom: rem(12),
            }}
          >
            Equipments Management
          </Box>
          <Box
            sx={{
              fontSize: rem(14),
              color: floowColors.grey[600],
              lineHeight: 1.6,
            }}
          >
            This section is under construction.
            <br />
            You can navigate between sections using the persistent sidebar.
          </Box>
        </Box>
      </ContentBox>
    </Box>
  );
};

export default EquipmentsPage;

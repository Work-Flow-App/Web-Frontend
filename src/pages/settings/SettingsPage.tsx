import React from 'react';
import { Box } from '@mui/material';
import { ThemeSettings } from './ThemeSettings';
import { BillingSettings } from './BillingSettings';

export const SettingsPage: React.FC = () => {
  return (
    <Box>
      <ThemeSettings />
      <BillingSettings />
    </Box>
  );
};

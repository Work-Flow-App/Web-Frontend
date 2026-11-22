import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { DesktopAlert } from '../../DesktopAlert';
import { RouteLineGlobalStyles } from './styles';
import * as styles from './styles';

export interface AuthShellProps {
  desktopMap: React.ReactNode;
  phoneMap: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  snackbar?: React.ReactNode;
  alert?: React.ReactNode;
}

export const AuthShell: React.FC<AuthShellProps> = ({
  desktopMap,
  phoneMap,
  children,
  footer,
  snackbar,
  alert,
}) => {
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down('md'));

  if (isPhone) {
    return (
      <Box sx={styles.phoneRoot}>
        {RouteLineGlobalStyles}
        <Box sx={styles.phoneMapHeader}>{phoneMap}</Box>
        <Box sx={styles.phoneCard}>
          {children}
          {footer}
        </Box>
        {alert !== undefined ? alert : <DesktopAlert />}
        {snackbar}
      </Box>
    );
  }

  return (
    <Box sx={styles.pageRoot}>
      {RouteLineGlobalStyles}
      <Box component="section" aria-label="Sample work day map" sx={styles.mapSection}>
        {desktopMap}
      </Box>
      <Box component="section" sx={styles.formSection}>
        <Box sx={styles.formCard}>{children}</Box>
        {footer}
      </Box>
      {alert !== undefined ? alert : <DesktopAlert />}
      {snackbar}
    </Box>
  );
};

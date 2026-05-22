import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import { ThemeSettings } from './ThemeSettings';
import { TeamPage } from './TeamPage';

export const SettingsPage: React.FC = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 4, pt: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab icon={<GroupOutlinedIcon fontSize="small" />} iconPosition="start" label="Team" />
          <Tab icon={<PaletteOutlinedIcon fontSize="small" />} iconPosition="start" label="Appearance" />
        </Tabs>
      </Box>
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {tab === 0 && <TeamPage />}
        {tab === 1 && <ThemeSettings />}
      </Box>
    </Box>
  );
};

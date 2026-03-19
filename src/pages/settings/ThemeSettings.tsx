import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  Paper,
  Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useThemeContext } from '../../contexts/ThemeContext';
import { THEME_PRESETS } from '../../theme/presets';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
  padding: theme.spacing(4),
  maxWidth: 800,
  margin: '0 auto',
}));

const Section = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
}));

const ColorCircle = styled(Box)<{ color: string; selected?: boolean }>(({ theme, color, selected }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: color,
  cursor: 'pointer',
  border: selected ? `3px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
  transition: 'transform 0.2s, border 0.2s',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));


export const ThemeSettings: React.FC = () => {
  const { mode, toggleColorMode, addTheme, activeThemeId, customThemes, switchTheme } = useThemeContext();
  const defaultPreset = THEME_PRESETS[0];
  const [customColor, setCustomColor] = useState(defaultPreset.colors.primary);
  const [customButtonColor, setCustomButtonColor] = useState(defaultPreset.colors.buttonPrimary ?? defaultPreset.colors.primary);
  const [themeName, setThemeName] = useState('');

  const handlePresetSelect = (preset: (typeof THEME_PRESETS)[number]) => {
    setCustomColor(preset.colors.primary);
    setCustomButtonColor(preset.colors.buttonPrimary ?? preset.colors.primary);
  };

  const handleCreateTheme = () => {
    if (themeName && customColor) {
      addTheme(themeName, {
        primary: customColor,
        buttonPrimary: customButtonColor || undefined,
      });
      setThemeName('');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Theme Settings
      </Typography>

      <Section elevation={0}>
        <Typography variant="h6" gutterBottom>
          Appearance
        </Typography>
        <FormControlLabel
          control={<Switch checked={mode === 'dark'} onChange={toggleColorMode} />}
          label={`Dark Mode (${mode === 'dark' ? 'On' : 'Off'})`}
        />
      </Section>

      <Section elevation={0}>
        <Typography variant="h6" gutterBottom>
          Primary Color
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Select a predefined color or enter a custom hex code.
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {THEME_PRESETS.map((preset) => (
            <Grid item key={preset.id}>
              <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                <ColorCircle
                  color={preset.colors.primary}
                  onClick={() => handlePresetSelect(preset)}
                  selected={customColor === preset.colors.primary}
                />
                <Typography variant="caption">{preset.name}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
            <TextField
                label="Custom Hex Color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  setCustomButtonColor(e.target.value);
                }}
                size="small"
                sx={{ width: 150 }}
            />
            <Box 
                sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 1, 
                    bgcolor: customColor,
                    border: (theme) => `1px solid ${theme.palette.divider}`
                }} 
            />
        </Box>

        <Box display="flex" gap={2} alignItems="flex-end">
             <TextField
                label="Theme Name"
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                size="small"
                placeholder="e.g. My Purple Theme"
            />
            <Button variant="contained" onClick={handleCreateTheme} disabled={!themeName || !customColor}>
                Save & Apply Theme
            </Button>
        </Box>
      </Section>

      {customThemes.length > 0 && (
        <Section elevation={0}>
            <Typography variant="h6" gutterBottom>
                Saved Themes
            </Typography>
            <Grid container spacing={2}>
                <Grid item>
                     <Button 
                        variant={activeThemeId === 'default' ? "contained" : "outlined"} 
                        onClick={() => switchTheme('default')}
                    >
                        Default Theme
                    </Button>
                </Grid>
                {customThemes.map(theme => (
                    <Grid item key={theme.id}>
                        <Button 
                            variant={activeThemeId === theme.id ? "contained" : "outlined"} 
                            onClick={() => switchTheme(theme.id)}
                            sx={{ 
                                borderColor: activeThemeId === theme.id ? 'primary.main' : undefined,
                                // Dynamically color the button border/text if not active to show hint? 
                                // Or just let the text be the name.
                            }}
                        >
                            {theme.name}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Section>
      )}
    </Container>
  );
};

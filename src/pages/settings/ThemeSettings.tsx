import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Switch, 
  FormControlLabel, 
  Divider, 
  TextField,
  Paper,
  Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useThemeContext } from '../../contexts/ThemeContext';
import { floowColors } from '../../theme/colors';

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

const PREDEFINED_COLORS = [
  { name: 'Default Black', color: floowColors.black },
  { name: 'Blue', color: floowColors.blue.main },
  { name: 'Indigo', color: floowColors.indigo.main },
  { name: 'Green', color: floowColors.success.main },
  { name: 'Red', color: floowColors.error.main },
  { name: 'Orange', color: floowColors.warning.main },
  { name: 'Purple', color: '#9c27b0' },
  { name: 'Teal', color: '#009688' },
];

export const ThemeSettings: React.FC = () => {
  const { mode, toggleColorMode, addTheme, activeThemeId, customThemes, switchTheme } = useThemeContext();
  const [customColor, setCustomColor] = useState('#000000');
  const [themeName, setThemeName] = useState('');

  const handleColorSelect = (color: string) => {
    // If it's one of the predefined, we can treat it as a new theme or just switch if we had IDs for them.
    // For simplicity, let's just create a new theme for any selection for now, or check if one exists.
    // Actually, to keep it simple and powerful:
    // 1. Show existing custom themes.
    // 2. Allow creating a new one from these presets or custom hex.
    setCustomColor(color);
  };

  const handleCreateTheme = () => {
    if (themeName && customColor) {
      addTheme(themeName, { primary: customColor });
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
          {PREDEFINED_COLORS.map((item) => (
            <Grid item key={item.name}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                  <ColorCircle 
                    color={item.color} 
                    onClick={() => handleColorSelect(item.color)}
                    selected={customColor === item.color}
                  />
                  <Typography variant="caption">{item.name}</Typography>
                </Box>
            </Grid>
          ))}
        </Grid>

        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
            <TextField
                label="Custom Hex Color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                size="small"
                sx={{ width: 150 }}
            />
            <Box 
                sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 1, 
                    bgcolor: customColor,
                    border: '1px solid #ccc'
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

import React, { useRef, useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  Paper,
  Chip,
  Divider,
  Tooltip,
  Button,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useForm, FormProvider } from 'react-hook-form';
import CheckIcon from '@mui/icons-material/Check';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import PaletteIcon from '@mui/icons-material/Palette';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useThemeContext } from '../../contexts/ThemeContext';
import { THEME_PRESETS } from '../../theme/presets';
import { Input } from '../../components/UI/Forms/Input';

/* ─── Styled ─────────────────────────────────────────────────── */

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 720,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
}));

const SectionLabel = styled(Typography)(() => ({
  fontWeight: 700,
  marginBottom: 4,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
}));

const SectionHint = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.82rem',
  marginBottom: theme.spacing(2.5),
}));

const ModeRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.spacing(1.5),
  background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
}));

const ColorDot = styled(Box)<{ selected?: boolean; dotcolor: string }>(
  ({ theme, dotcolor, selected }) => ({
    width: 44,
    height: 44,
    borderRadius: '50%',
    backgroundColor: dotcolor,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: selected ? `3px solid ${theme.palette.text.primary}` : '2px solid transparent',
    boxShadow: selected
      ? `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${dotcolor}`
      : 'none',
    transition: 'transform 0.15s, box-shadow 0.15s',
    '&:hover': { transform: 'scale(1.12)' },
  })
);

const ColorPickerButton = styled(Box)<{ dotcolor: string }>(({ theme, dotcolor }) => ({
  width: 64,
  height: 64,
  borderRadius: theme.spacing(1.5),
  backgroundColor: dotcolor,
  cursor: 'pointer',
  position: 'relative',
  border: `2px solid ${theme.palette.divider}`,
  transition: 'transform 0.15s',
  '&:hover': { transform: 'scale(1.05)' },
  '&:hover .edit-icon': { opacity: 1 },
}));

const EditOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  borderRadius: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0,0,0,0.35)',
  opacity: 0,
  transition: 'opacity 0.15s',
  '& svg': { color: theme.palette.common.white, fontSize: 20 },
}));

/* ─── Component ──────────────────────────────────────────────── */

interface ThemeFormValues {
  themeName: string;
}

export const ThemeSettings: React.FC = () => {
  const { mode, toggleColorMode, addTheme, activeThemeId, customThemes, switchTheme } =
    useThemeContext();

  const [customColor, setCustomColor] = useState('#101a32');
  const colorInputRef = useRef<HTMLInputElement>(null);

  const methods = useForm<ThemeFormValues>({ defaultValues: { themeName: '' } });
  const { handleSubmit, reset, watch } = methods;
  const themeName = watch('themeName');

  const handleSave = ({ themeName }: ThemeFormValues) => {
    if (themeName.trim() && customColor) {
      addTheme(themeName.trim(), { primary: customColor, buttonPrimary: customColor });
      reset();
    }
  };

  return (
    <PageContainer>
      {/* Page heading */}
      <Box>
        <Typography variant="h5" fontWeight={700}>
          Theme Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Personalize how your workspace looks and feels.
        </Typography>
      </Box>

      {/* ── Appearance ── */}
      <Card>
        <SectionLabel variant="subtitle1">
          {mode === 'dark' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
          Appearance
        </SectionLabel>
        <SectionHint>Switch between a light or dark workspace.</SectionHint>

        <ModeRow>
          <Box display="flex" alignItems="center" gap={1.5}>
            {mode === 'dark' ? (
              <DarkModeIcon fontSize="small" color="action" />
            ) : (
              <LightModeIcon fontSize="small" color="action" />
            )}
            <Typography fontWeight={500}>
              {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </Typography>
            <Chip
              label={mode === 'dark' ? 'On' : 'Off'}
              size="small"
              color={mode === 'dark' ? 'primary' : 'default'}
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          </Box>
          <Switch checked={mode === 'dark'} onChange={toggleColorMode} color="primary" />
        </ModeRow>
      </Card>

      {/* ── Preset Colors ── */}
      <Card>
        <SectionLabel variant="subtitle1">
          <PaletteIcon fontSize="small" />
          Brand Color
        </SectionLabel>
        <SectionHint>Choose a color that matches your company brand. It applies across the whole app instantly.</SectionHint>

        <Box display="flex" flexWrap="wrap" gap={2.5}>
          {THEME_PRESETS.map((preset) => {
            const isActive = activeThemeId === preset.id;
            return (
              <Tooltip key={preset.id} title={preset.name} placement="top" arrow>
                <Box display="flex" flexDirection="column" alignItems="center" gap={0.75}>
                  <ColorDot
                    dotcolor={preset.colors.primary}
                    selected={isActive}
                    onClick={() => switchTheme(preset.id)}
                  >
                    {isActive && (
                      <CheckIcon
                        sx={{
                          color: '#fff',
                          fontSize: 18,
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
                        }}
                      />
                    )}
                  </ColorDot>
                  <Typography
                    variant="caption"
                    fontWeight={isActive ? 700 : 400}
                    color={isActive ? 'text.primary' : 'text.secondary'}
                  >
                    {preset.name}
                  </Typography>
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Card>

      {/* ── Custom Color ── */}
      <Card>
        <SectionLabel variant="subtitle1">Create a Custom Theme</SectionLabel>
        <SectionHint>
          Pick any color you like and give it a name to save it as your own theme.
        </SectionHint>

        {/* Color picker row */}
        <Box display="flex" alignItems="center" gap={2.5} mb={3}>
          <Tooltip title="Click to pick a color" placement="top" arrow>
            <ColorPickerButton
              dotcolor={customColor}
              onClick={() => colorInputRef.current?.click()}
              role="button"
              aria-label="Pick a color"
            >
              <EditOverlay className="edit-icon">
                <EditIcon />
              </EditOverlay>
              {/* Hidden native color picker */}
              <input
                ref={colorInputRef}
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                tabIndex={-1}
              />
            </ColorPickerButton>
          </Tooltip>

          <Box>
            <Typography fontWeight={600} fontSize="0.95rem">
              Selected Color
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click the swatch to open the color picker
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        {/* Theme name + save using existing Input component */}
        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={handleSubmit(handleSave)}
            display="flex"
            gap={2}
            alignItems="flex-end"
            flexWrap="wrap"
          >
            <Box flex={1} minWidth={200}>
              <Input
                name="themeName"
                label="Theme Name"
                placeholder="e.g. Brand Blue, Company Red…"
                fullWidth
                required
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              startIcon={<AddIcon />}
              disabled={!themeName?.trim() || !customColor}
              disableElevation
              sx={{ height: 48, whiteSpace: 'nowrap' }}
            >
              Save & Apply
            </Button>
          </Box>
        </FormProvider>
      </Card>

      {/* ── Saved Custom Themes ── */}
      {customThemes.length > 0 && (
        <Card>
          <SectionLabel variant="subtitle1">Your Saved Themes</SectionLabel>
          <SectionHint>Click any saved theme to switch to it.</SectionHint>
          <Box display="flex" flexWrap="wrap" gap={1.5}>
            {customThemes.map((theme) => {
              const isActive = activeThemeId === theme.id;
              return (
                <Chip
                  key={theme.id}
                  label={theme.name}
                  onClick={() => switchTheme(theme.id)}
                  icon={isActive ? <CheckIcon /> : undefined}
                  color={isActive ? 'primary' : 'default'}
                  variant={isActive ? 'filled' : 'outlined'}
                  sx={{ fontWeight: isActive ? 700 : 400 }}
                />
              );
            })}
          </Box>
        </Card>
      )}
    </PageContainer>
  );
};

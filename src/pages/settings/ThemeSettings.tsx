import React, { useRef, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Tooltip,
  Button,
  IconButton,
  alpha,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useForm, FormProvider } from 'react-hook-form';
import CheckIcon from '@mui/icons-material/Check';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useThemeContext } from '../../contexts/ThemeContext';
import { THEME_PRESETS } from '../../theme/presets';
import { Input } from '../../components/UI/Forms/Input';

/* ─── Styled ─────────────────────────────────────────────────── */

const PageRoot = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 4, 6),
  maxWidth: 860,
}));

const PageHeader = styled(Box)(({ theme }) => ({
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(4),
}));

const Section = styled(Paper)(({ theme }) => ({
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  overflow: 'hidden',
  marginBottom: theme.spacing(2.5),
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  background:
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.02)
      : alpha(theme.palette.common.black, 0.015),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

const SectionBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

/* Mode Cards */

const ModeCard = styled(Box)<{ selected: boolean }>(({ theme, selected }) => ({
  width: 180,
  borderRadius: 10,
  border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  cursor: 'pointer',
  overflow: 'hidden',
  transition: 'border-color 0.18s, box-shadow 0.18s',
  boxShadow: selected
    ? `0 0 0 3px ${alpha(theme.palette.primary.main, 0.18)}`
    : 'none',
  '&:hover': {
    borderColor: selected ? theme.palette.primary.main : theme.palette.primary.light,
  },
}));

const ModePreview = styled(Box)<{ isdark: string }>(({ isdark }) => ({
  height: 96,
  background: isdark === 'true' ? '#1e2533' : '#f0f2f5',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: '10px 10px 0',
}));

const PreviewBar = styled(Box)<{ isdark: string }>(({ isdark }) => ({
  height: 8,
  borderRadius: 4,
  background: isdark === 'true' ? '#2d3650' : '#dde1ea',
}));

const PreviewSidebar = styled(Box)<{ isdark: string; accent: string }>(({ isdark, accent }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: 28,
  background: accent,
  opacity: isdark === 'true' ? 0.9 : 1,
}));

const PreviewContent = styled(Box)(({ theme: _t }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
  paddingLeft: 36,
  paddingTop: 8,
  flex: 1,
}));

const PreviewRow = styled(Box)<{ isdark: string; width?: string }>(({ isdark, width = '70%' }) => ({
  height: 7,
  borderRadius: 3,
  width,
  background: isdark === 'true' ? '#3a4460' : '#d0d4df',
}));

const ModeCardFooter = styled(Box)<{ isdark: string; selected: boolean }>(
  ({ theme, isdark, selected }) => ({
    padding: theme.spacing(1.25, 2),
    background: isdark === 'true' ? '#252c3d' : '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  })
);

/* Color Swatches */

const SwatchGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
  gap: 12,
}));

const SwatchTile = styled(Box)<{ selected: boolean; swatchcolor: string }>(
  ({ theme, selected, swatchcolor }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
    '& .swatch-circle': {
      width: 44,
      height: 44,
      borderRadius: '50%',
      backgroundColor: swatchcolor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: selected
        ? `3px solid ${theme.palette.text.primary}`
        : `2px solid transparent`,
      boxShadow: selected
        ? `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${swatchcolor}`
        : `0 2px 6px ${alpha(swatchcolor, 0.4)}`,
      transition: 'transform 0.14s, box-shadow 0.14s',
    },
    '&:hover .swatch-circle': {
      transform: 'scale(1.1)',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${swatchcolor}`,
    },
  })
);

/* Custom theme picker */

const ColorSwatch = styled(Box)<{ swatchcolor: string }>(({ theme, swatchcolor }) => ({
  width: 48,
  height: 48,
  borderRadius: 8,
  backgroundColor: swatchcolor,
  cursor: 'pointer',
  border: `2px solid ${theme.palette.divider}`,
  position: 'relative',
  flexShrink: 0,
  transition: 'transform 0.14s',
  '&:hover': { transform: 'scale(1.06)' },
  '&:hover .edit-overlay': { opacity: 1 },
}));

const EditOverlay = styled(Box)(() => ({
  position: 'absolute',
  inset: 0,
  borderRadius: 'inherit',
  background: 'rgba(0,0,0,0.38)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.14s',
  '& svg': { color: '#fff', fontSize: 18 },
}));

/* Saved theme row */

const SavedThemeRow = styled(Box)<{ selected: boolean }>(({ theme, selected }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(1.25, 2),
  borderRadius: 8,
  cursor: 'pointer',
  background: selected
    ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.15 : 0.07)
    : 'transparent',
  border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  transition: 'background 0.15s, border-color 0.15s',
  '&:hover': {
    background: selected
      ? alpha(theme.palette.primary.main, 0.12)
      : alpha(theme.palette.action.hover, 1),
  },
}));

/* ─── Component ──────────────────────────────────────────────── */

interface ThemeFormValues {
  themeName: string;
}

export const ThemeSettings: React.FC = () => {
  const theme = useTheme();
  const { mode, toggleColorMode, addTheme, removeTheme, activeThemeId, customThemes, switchTheme } =
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

  // Derive accent color for mode preview from active preset
  const activePreset = THEME_PRESETS.find((p) => p.id === activeThemeId);
  const accentColor = activePreset?.colors.primary ?? '#101a32';

  return (
    <PageRoot>
      {/* ── Page header ── */}
      <PageHeader>
        <Typography variant="h5" fontWeight={700} letterSpacing="-0.3px">
          Appearance
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Customize the look and feel of your workspace. Changes apply instantly.
        </Typography>
      </PageHeader>

      {/* ── Interface Mode ── */}
      <Section>
        <SectionHeader>
          {mode === 'dark' ? (
            <DarkModeOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          ) : (
            <LightModeOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          )}
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              Interface Mode
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Choose between light or dark theme for your workspace
            </Typography>
          </Box>
        </SectionHeader>

        <SectionBody>
          <Box display="flex" gap={2.5} flexWrap="wrap">
            {/* Light mode card */}
            <ModeCard selected={mode === 'light'} onClick={() => mode === 'dark' && toggleColorMode()}>
              <ModePreview isdark="false">
                <PreviewSidebar isdark="false" accent={accentColor} />
                <PreviewContent>
                  <PreviewRow isdark="false" width="55%" />
                  <PreviewRow isdark="false" width="80%" />
                  <PreviewRow isdark="false" width="40%" />
                </PreviewContent>
              </ModePreview>
              <ModeCardFooter isdark="false" selected={mode === 'light'}>
                <Box display="flex" alignItems="center" gap={1}>
                  <LightModeOutlinedIcon sx={{ fontSize: 15, color: mode === 'light' ? accentColor : '#888' }} />
                  <Typography variant="caption" fontWeight={600} sx={{ color: mode === 'light' ? accentColor : '#555' }}>
                    Light
                  </Typography>
                </Box>
                {mode === 'light' && (
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: accentColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckIcon sx={{ fontSize: 10, color: '#fff' }} />
                  </Box>
                )}
              </ModeCardFooter>
            </ModeCard>

            {/* Dark mode card */}
            <ModeCard selected={mode === 'dark'} onClick={() => mode === 'light' && toggleColorMode()}>
              <ModePreview isdark="true">
                <PreviewSidebar isdark="true" accent={accentColor} />
                <PreviewContent>
                  <PreviewRow isdark="true" width="55%" />
                  <PreviewRow isdark="true" width="80%" />
                  <PreviewRow isdark="true" width="40%" />
                </PreviewContent>
              </ModePreview>
              <ModeCardFooter isdark="true" selected={mode === 'dark'}>
                <Box display="flex" alignItems="center" gap={1}>
                  <DarkModeOutlinedIcon sx={{ fontSize: 15, color: mode === 'dark' ? theme.palette.primary.light : '#aaa' }} />
                  <Typography variant="caption" fontWeight={600} sx={{ color: mode === 'dark' ? theme.palette.primary.light : '#999' }}>
                    Dark
                  </Typography>
                </Box>
                {mode === 'dark' && (
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckIcon sx={{ fontSize: 10, color: '#fff' }} />
                  </Box>
                )}
              </ModeCardFooter>
            </ModeCard>
          </Box>
        </SectionBody>
      </Section>

      {/* ── Accent Color ── */}
      <Section>
        <SectionHeader>
          <PaletteOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              Accent Color
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Select the primary color applied across the navigation and UI accents
            </Typography>
          </Box>
        </SectionHeader>

        <SectionBody>
          <SwatchGrid>
            {THEME_PRESETS.map((preset) => {
              const isActive = activeThemeId === preset.id;
              return (
                <SwatchTile
                  key={preset.id}
                  selected={isActive}
                  swatchcolor={preset.colors.primary}
                  onClick={() => switchTheme(preset.id)}
                >
                  <Tooltip title={preset.name} placement="top" arrow>
                    <Box className="swatch-circle">
                      {isActive && (
                        <CheckIcon
                          sx={{
                            color: '#fff',
                            fontSize: 16,
                            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
                          }}
                        />
                      )}
                    </Box>
                  </Tooltip>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: isActive ? 700 : 400,
                      color: isActive ? 'text.primary' : 'text.secondary',
                      textAlign: 'center',
                      lineHeight: 1.2,
                    }}
                  >
                    {preset.name}
                  </Typography>
                </SwatchTile>
              );
            })}
          </SwatchGrid>
        </SectionBody>
      </Section>

      {/* ── Custom Theme ── */}
      <Section>
        <SectionHeader>
          <AddIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              Custom Theme
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Create a branded color theme and save it for future use
            </Typography>
          </Box>
        </SectionHeader>

        <SectionBody>
          <FormProvider {...methods}>
            <Box
              component="form"
              onSubmit={handleSubmit(handleSave)}
              display="flex"
              gap={2}
              alignItems="flex-end"
              flexWrap="wrap"
            >
              {/* Color swatch trigger */}
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={500}
                  display="block"
                  mb={0.75}
                >
                  Color
                </Typography>
                <Tooltip title="Click to pick a color" placement="top" arrow>
                  <ColorSwatch
                    swatchcolor={customColor}
                    onClick={() => colorInputRef.current?.click()}
                    role="button"
                    aria-label="Pick a color"
                  >
                    <EditOverlay className="edit-overlay">
                      <PaletteOutlinedIcon />
                    </EditOverlay>
                    <input
                      ref={colorInputRef}
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                      tabIndex={-1}
                    />
                  </ColorSwatch>
                </Tooltip>
              </Box>

              {/* Hex display */}
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={500}
                  display="block"
                  mb={0.75}
                >
                  Hex Value
                </Typography>
                <Box
                  sx={{
                    height: 48,
                    px: 2,
                    borderRadius: 1.5,
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    background: theme.palette.background.paper,
                    minWidth: 110,
                  }}
                >
                  <Typography variant="body2" fontFamily="monospace" fontWeight={600} color="text.primary">
                    {customColor.toUpperCase()}
                  </Typography>
                </Box>
              </Box>

              {/* Theme name input */}
              <Box flex={1} minWidth={180}>
                <Input
                  name="themeName"
                  label="Theme Name"
                  placeholder="e.g. Brand Blue, Corporate Red…"
                  fullWidth
                  required
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                disableElevation
                disabled={!themeName?.trim() || !customColor}
                sx={{ height: 48, whiteSpace: 'nowrap', borderRadius: 1.5, px: 3 }}
              >
                Save Theme
              </Button>
            </Box>
          </FormProvider>
        </SectionBody>
      </Section>

      {/* ── Saved Custom Themes ── */}
      {customThemes.length > 0 && (
        <Section>
          <SectionHeader>
            <PaletteOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                Saved Themes
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Your custom color themes — click to activate
              </Typography>
            </Box>
          </SectionHeader>

          <SectionBody>
            <Box display="flex" flexDirection="column" gap={1.25}>
              {customThemes.map((ct) => {
                const isActive = activeThemeId === ct.id;
                return (
                  <SavedThemeRow
                    key={ct.id}
                    selected={isActive}
                    onClick={() => switchTheme(ct.id)}
                  >
                    {/* Color dot */}
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: ct.colors.primary,
                        flexShrink: 0,
                        boxShadow: `0 2px 6px ${alpha(ct.colors.primary, 0.45)}`,
                      }}
                    />

                    {/* Name + hex */}
                    <Box flex={1}>
                      <Typography variant="body2" fontWeight={isActive ? 700 : 500}>
                        {ct.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontFamily="monospace"
                      >
                        {ct.colors.primary.toUpperCase()}
                      </Typography>
                    </Box>

                    {/* Active badge */}
                    {isActive && (
                      <Box
                        sx={{
                          px: 1.25,
                          py: 0.25,
                          borderRadius: 1,
                          background: alpha(theme.palette.primary.main, 0.12),
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                        }}
                      >
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          color="primary"
                          sx={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}
                        >
                          ACTIVE
                        </Typography>
                      </Box>
                    )}

                    {/* Delete */}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTheme(ct.id);
                      }}
                      sx={{
                        color: 'text.disabled',
                        '&:hover': { color: 'error.main' },
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </SavedThemeRow>
                );
              })}
            </Box>
          </SectionBody>
        </Section>
      )}

      {/* Footer note */}
      <Box mt={3} px={0.5}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="caption" color="text.disabled">
          Theme preferences are saved locally in your browser and apply only to your session.
        </Typography>
      </Box>
    </PageRoot>
  );
};

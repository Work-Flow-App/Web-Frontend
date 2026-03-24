import { floowColors } from './colors';
import type { CustomThemeColors } from './palette';

export interface ThemePreset {
  id: string;
  name: string;
  colors: CustomThemeColors;
}

/**
 * Predefined theme presets.
 * Each entry pairs a `primary` brand color (used for sidebar, headers, accents)
 * with a `buttonPrimary` color that is UX-friendly on white backgrounds.
 * For the default theme they are the same; for brighter/lighter hues the
 * button color is a slightly darker shade to ensure legible contrast.
 *
 * To add a new preset: append an entry here — no other file needs to change.
 */
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'default',
    name: 'Default',
    colors: { primary: floowColors.navy, buttonPrimary: floowColors.navy },
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    colors: { primary: '#0ea5e9', buttonPrimary: '#38bdf8' },
  },
  {
    id: 'indigo',
    name: 'Indigo',
    colors: { primary: '#4f46e5', buttonPrimary: '#6366f1' },
  },
  {
    id: 'violet',
    name: 'Violet',
    colors: { primary: '#7c3aed', buttonPrimary: '#8b5cf6' },
  },
  {
    id: 'purple',
    name: 'Purple',
    colors: { primary: '#9c27b0', buttonPrimary: '#ba68c8' },
  },
  {
    id: 'emerald',
    name: 'Emerald',
    colors: { primary: '#059669', buttonPrimary: '#10b981' },
  },
  {
    id: 'teal',
    name: 'Teal',
    colors: { primary: '#0d9488', buttonPrimary: '#14b8a6' },
  },
  {
    id: 'sky',
    name: 'Sky',
    colors: { primary: '#0284c7', buttonPrimary: '#0ea5e9' },
  },
  {
    id: 'navy',
    name: 'Navy',
    colors: { primary: '#1e3a5f', buttonPrimary: '#1e3a5f' },
  },
  {
    id: 'slate',
    name: 'Slate',
    colors: { primary: '#475569', buttonPrimary: '#64748b' },
  },
  {
    id: 'amber',
    name: 'Amber',
    colors: { primary: '#d97706', buttonPrimary: '#f59e0b' },
  },
  {
    id: 'rose',
    name: 'Rose',
    colors: { primary: '#f43f5e', buttonPrimary: '#fb7185' },
  },
  {
    id: 'crimson',
    name: 'Crimson',
    colors: { primary: '#dc2626', buttonPrimary: '#ef4444' },
  },
];

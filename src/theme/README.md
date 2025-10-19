# Floow Design System - MUI Theme

This theme is based on the Floow Figma design and implements the complete design system using Material-UI (MUI).

## Color Palette

### Primary Colors
- **Black**: `#000000` - Primary brand color, used for main buttons and headers
- **Dark Black**: `#0A0A0A` - Darker variant
- **White**: `#FFFFFF` - Background and contrast text

### Grey Scale
- **Grey 50**: `#FAFAFA` - Lightest grey, backgrounds
- **Grey 100**: `#F5F5F5` - Paper/card backgrounds
- **Grey 200**: `#E5E5E5` - Borders, dividers
- **Grey 300**: `#D4D4D4` - Disabled text
- **Grey 400**: `#A1A1A1` - Secondary text
- **Grey 500**: `#737373` - Subscription text
- **Grey 600**: `#525252` - Icon colors, borders
- **Grey 700**: `#404040` - Dark icons
- **Grey 800**: `#262626` - Primary text
- **Grey 900**: `#171717` - Secondary background

### Status Colors
- **Success**: `#00A63E` - Success states, active indicators
- **Error**: `#FB2C36` - Error states, logout button

## Typography

### Font Family
**Manrope** - Primary font family with fallbacks

### Size Scale
- **3XL**: 30px/41px - Main headings (h1)
- **2XL**: 24px/33px - Section headings (h2)
- **XL**: 20px/27px - Card titles (h3)
- **Large**: 18px/25px - Subheadings (h4)
- **Base**: 16px/24px - Body text, buttons
- **SM**: 14px/20px - Small text, captions

### Font Weights
- **400**: Regular - Body text
- **500**: Medium - Base text, inputs
- **600**: Semi-Bold - Buttons, emphasized text
- **700**: Bold - Headings

## Component Styles

### Buttons
- **Border Radius**: 6-8px depending on size
- **Padding**: 12px 24px
- **Height**: Small (36px), Medium (44px), Large (48px)
- **Font**: 16px, weight 600

### Text Fields
- **Border Radius**: 6px
- **Background**: #FAFAFA
- **Border**: #F5F5F5 (default), #000000 (focused)

### Cards (Glass Morphism)
- **Border Radius**: 16px
- **Background**: rgba(255, 255, 255, 0.02)
- **Border**: 3px solid rgba(255, 255, 255, 0.25)
- **Shadow**: 0px 16px 24px rgba(0, 0, 0, 0.5)
- **Backdrop Filter**: blur(20px)

### Tables
- **Border**: 1px solid #F5F5F5
- **Header Background**: #FAFAFA
- **Border Radius**: 8px

## Usage

```tsx
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import { floowColors } from './theme/colors';

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* Your app content */}
    </ThemeProvider>
  );
}

// Using colors directly
const myStyle = {
  color: floowColors.text.primary,
  backgroundColor: floowColors.grey[100],
};
```

## Spacing System
MUI uses 8px base spacing unit. Use theme spacing multipliers:
- `theme.spacing(1)` = 8px
- `theme.spacing(2)` = 16px
- `theme.spacing(3)` = 24px
- etc.

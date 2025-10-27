# FloowLogo Component

A React component that displays the Floow brand logo with optional text.

## Usage

```tsx
import { FloowLogo } from '@components/UI';

// Default light variant with text (for light backgrounds)
<FloowLogo />

// White variant with gradient text (for dark backgrounds)
<FloowLogo variant="white" />

// Logo only (no text)
<FloowLogo showText={false} />

// Custom size
<FloowLogo width="100px" height="100px" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showText` | `boolean` | `true` | Show or hide the "Floow" text next to the logo |
| `width` | `string \| number` | `66px` | Custom width for the logo icon |
| `height` | `string \| number` | `66px` | Custom height for the logo icon |
| `variant` | `'light' \| 'white'` | `'light'` | Logo variant - light (black text for light backgrounds) or white (white gradient text for dark backgrounds) |

## Examples

### Default Logo (Light Variant)
```tsx
<FloowLogo />
```

### White Variant with Gradient Text (For Dark Backgrounds)
```tsx
<FloowLogo variant="white" />
```

### Logo Only (No Text)
```tsx
<FloowLogo showText={false} />
```

### White Variant Logo Only
```tsx
<FloowLogo variant="white" showText={false} />
```

### Custom Size
```tsx
<FloowLogo width="120px" height="120px" />
```

### Small Size
```tsx
<FloowLogo width={40} height={40} />
```

## Design

The FloowLogo component consists of:
- A stylized "F" icon with gradient effects in a rounded square (66x66px)
  - **Light variant logo**: Black "F" with light gradients (floow_logo.svg)
  - **White variant logo**: White "F" with dark gradients (floow_logo_white.svg)
- The "Floow" text with two variants:
  - **Light variant**: Black text (#000000) - for light backgrounds (default)
  - **White variant**: White-to-gray gradient text (#FFFFFF to #999999) - for dark backgrounds
- Both elements are horizontally aligned with consistent spacing
- Font: Safiro (with Manrope and Arial fallbacks)
- Font size: 60px
- Font weight: 500
- Line height: 72px

### Variant Details

| Variant | Logo SVG | Text Color | Use Case |
|---------|----------|------------|----------|
| Light (default) | floow_logo.svg (black "F") | Black (#000000) | Light backgrounds |
| White | floow_logo_white.svg (white "F") | White gradient (#FFF → #999) | Dark backgrounds |

## File Structure

```
FloowLogo/
├── FloowLogo.tsx           # Main component
├── FloowLogo.styled.tsx    # Styled components
├── FloowLogo.types.ts      # TypeScript types
├── FloowLogo.stories.tsx   # Storybook stories
├── index.ts                # Exports
└── README.md               # Documentation
```

# Button Component

A reusable button component based on the Floow design system, matching Figma specifications.

## Features

- ✅ Four variants: Primary, Secondary, Outlined, Text
- ✅ Three sizes: Small, Medium, Large
- ✅ Icon support (start/end icons)
- ✅ Full width option
- ✅ Disabled state
- ✅ Manrope font (700 weight)
- ✅ rem-based sizing
- ✅ Exact Figma specifications

## Usage

```tsx
import { Button } from '@/components/UI';

// Primary button (Log in)
<Button variant="primary" size="large">
  Log in
</Button>

// Secondary button (Cancel)
<Button variant="secondary" size="large">
  Cancel
</Button>

// Outlined button (Create an account)
<Button variant="outlined" size="large">
  Create an account
</Button>

// Button with icon (Add Member)
<Button variant="primary" size="large" startIcon={<UserAddIcon />}>
  Add Member
</Button>

// Full width button
<Button variant="primary" size="large" fullWidth>
  Submit
</Button>

// Disabled button
<Button variant="primary" size="large" disabled>
  Disabled
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Button content/label |
| `variant` | `'primary' \| 'secondary' \| 'outlined' \| 'text'` | `'primary'` | Visual style variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `startIcon` | `ReactNode` | - | Icon before text |
| `endIcon` | `ReactNode` | - | Icon after text |
| `fullWidth` | `boolean` | `false` | Take full container width |
| `disabled` | `boolean` | `false` | Disable button |
| `onClick` | `(event) => void` | - | Click handler |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Button type |
| `className` | `string` | - | Additional CSS classes |
| `style` | `CSSProperties` | - | Custom inline styles |

## Sizes

### Small
- Height: `2.25rem` (36px)
- Padding: `0.5rem 1rem` (8px 16px)
- Font Size: `0.875rem` (14px)
- Border Radius: `0.375rem` (6px)

### Medium
- Height: `3rem` (48px)
- Padding: `0.75rem 1.5rem` (12px 24px)
- Font Size: `1rem` (16px)
- Border Radius: `0.375rem` (6px)

### Large (Figma default)
- Height: `3.1875rem` (51px)
- Padding: `0.75rem 1.5rem` (12px 24px)
- Font Size: `1.25rem` (20px) - XL/Bold
- Border Radius: `0.5rem` (8px)

## Variants

### Primary
- Background: `#000000`
- Color: `#FFFFFF`
- Hover: `#333333`

### Secondary
- Background: `#F5F5F5`
- Color: `#000000`
- Hover: `#E5E5E5`

### Outlined
- Background: `transparent`
- Color: `#000000`
- Border: `2px solid #E5E5E5`
- Height: `49px` (large size)
- Hover: `rgba(0, 0, 0, 0.02)` with darker border

### Text
- Background: `transparent`
- Color: `#000000`
- Hover: `rgba(0, 0, 0, 0.04)`

## Storybook

View all button variations in Storybook:

```bash
npm run storybook
```

Navigate to: `UI/Button`

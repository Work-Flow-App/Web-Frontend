# UI Components

Reusable UI components following the Floow design system from Figma.

## Structure

```
src/components/UI/
├── Button/
│   ├── Button.tsx          # Main component
│   ├── Button.types.ts     # TypeScript types
│   ├── Button.styles.ts    # Separated styles
│   ├── Button.stories.tsx  # Storybook stories
│   ├── README.md           # Component documentation
│   └── index.ts            # Export file
└── index.ts                # Main export file
```

## Design System Principles

### ✅ Separation of Concerns
- **Component logic** in `.tsx` files
- **Type definitions** in `.types.ts` files
- **Styles** in `.styles.ts` files
- **Documentation** in Storybook `.stories.tsx` files

### ✅ Standards
- **rem-based sizing** (16px = 1rem) for accessibility
- **Manrope font** from Figma specifications
- **TypeScript** with strict type checking
- **MUI integration** for theme consistency
- **Storybook** for component showcase and testing

## Available Components

### Button
A fully customizable button component with three variants (primary, secondary, text) and three sizes (small, medium, large).

[View Documentation](./Button/README.md)

## Usage

```tsx
import { Button } from '@/components/UI';

function MyComponent() {
  return (
    <Button variant="primary" size="large">
      Click Me
    </Button>
  );
}
```

## Storybook

View all components in Storybook:

```bash
npm run storybook
```

## Creating New Components

When creating new UI components, follow this structure:

1. **Create component folder**: `src/components/UI/ComponentName/`
2. **Add files**:
   - `ComponentName.tsx` - Main component
   - `ComponentName.types.ts` - TypeScript interfaces
   - `ComponentName.styles.ts` - Separated MUI styles
   - `ComponentName.stories.tsx` - Storybook stories
   - `README.md` - Component documentation
   - `index.ts` - Export file

3. **Update exports**: Add to `src/components/UI/index.ts`

## Design Tokens

All components use the centralized theme:
- Colors: `src/theme/colors.ts`
- Theme: `src/theme/theme.ts`
- Typography: Manrope font with standardized sizes
- Spacing: 8px base unit (0.5rem)

## Best Practices

1. **Use rem units** for all sizing (not px)
2. **Follow Figma specs** exactly for design fidelity
3. **Separate styles** from component logic
4. **Document props** with JSDoc comments
5. **Create stories** for all variants and states
6. **Export types** for consumers
7. **Write README** with usage examples

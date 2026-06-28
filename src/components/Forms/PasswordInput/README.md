# PasswordInput Component

A reusable password input component with show/hide toggle functionality, built on top of the base Input component.

## Features

- ✅ Password visibility toggle (eye icon)
- ✅ Inherits all Input component features (labels, errors, sizes, etc.)
- ✅ Accessible (ARIA labels, keyboard navigation)
- ✅ TypeScript support
- ✅ React Hook Form compatible
- ✅ Custom styling with Emotion

## Usage

### Basic Example

```tsx
import { PasswordInput } from '@/components/UI/Forms/PasswordInput';

function MyForm() {
  return (
    <PasswordInput
      name="password"
      label="Password"
      placeholder="Enter your password"
    />
  );
}
```

### With React Hook Form

```tsx
import { useForm } from 'react-hook-form';
import { PasswordInput } from '@/components/UI/Forms/PasswordInput';

function SignupForm() {
  const { register, formState: { errors } } = useForm();

  return (
    <PasswordInput
      label="Create Password"
      placeholder="Enter your password"
      {...register('password', {
        required: 'Password is required',
        minLength: {
          value: 8,
          message: 'Password must be at least 8 characters',
        },
      })}
      error={errors.password}
      helperText="Minimum 8 characters"
    />
  );
}
```

### Different Sizes

```tsx
<PasswordInput name="password" size="small" label="Small" />
<PasswordInput name="password" size="medium" label="Medium" />
<PasswordInput name="password" size="large" label="Large" />
```

### Full Width

```tsx
<PasswordInput
  name="password"
  label="Password"
  fullWidth
/>
```

### Without Toggle Button

```tsx
<PasswordInput
  name="password"
  label="Password"
  showToggle={false}
/>
```

### Disabled State

```tsx
<PasswordInput
  name="password"
  label="Password"
  disabled
/>
```

## Props

Extends all `InputProps` except `type` and `endIcon`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showToggle` | `boolean` | `true` | Show/hide the password visibility toggle button |
| `label` | `string` | - | Label text for the input |
| `error` | `{ message?: string } \| boolean` | - | Error state and message |
| `helperText` | `string` | - | Helper text below the input |
| `fullWidth` | `boolean` | `false` | Make input take full width |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Input size |
| `disabled` | `boolean` | `false` | Disable the input |
| `placeholder` | `string` | - | Placeholder text |
| `name` | `string` | - | Input name (required for forms) |

Plus all standard HTML input attributes.

## Component Structure

```
PasswordInput/
├── PasswordInput.tsx          # Main component
├── PasswordInput.styles.tsx   # Styled components and icons
├── PasswordInput.types.ts     # TypeScript types
├── PasswordInput.stories.tsx  # Storybook stories
├── index.ts                   # Exports
└── README.md                  # Documentation
```

## Accessibility

- Toggle button has proper ARIA labels
- Keyboard accessible (Tab navigation, Enter/Space to toggle)
- Focus visible styles
- Password masking for screen readers

## Styling

The component uses Emotion for styling and inherits the base Input component's styles. The visibility toggle button:

- Changes color on hover
- Has a subtle background on hover/active
- Shows focus ring for keyboard navigation
- Uses SVG icons for visibility/visibility-off

## Examples

See the Storybook stories for interactive examples:

```bash
npm run storybook
```

Then navigate to `UI/Forms/PasswordInput` in the Storybook UI.

## Related Components

- [Input](../Input/README.md) - Base input component
- [RadioGroup](../Radio/README.md) - Radio button group
- [Dropdown](../Dropdown/README.md) - Dropdown/select component

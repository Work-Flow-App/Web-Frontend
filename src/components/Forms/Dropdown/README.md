# Dropdown Component

A powerful, feature-rich dropdown component built with Material-UI Autocomplete, following the Floow design system specifications from Figma.

## Design Specifications

Matches Figma design exactly:
- **Background**: `#FAFAFA`
- **Border**: `1px solid #F5F5F5`
- **Border Radius**: `6px`
- **Height**: `44px`
- **Padding**: `10px 20px`
- **Sizes**:
  - Small: `426px` width
  - Full: `922px` width
  - Medium: Auto width

## Features

### Core Features
- ✅ React Hook Form integration
- ✅ TypeScript support with comprehensive types
- ✅ Figma design specifications
- ✅ Multiple size variants (small, medium, full)
- ✅ Searchable/filterable options
- ✅ Custom styling with MUI theme integration

### Advanced Features
- ✅ **Async Data Fetching**: Support for API-based data loading
- ✅ **Dependency Management**: Cascading dropdowns with parent-child relationships
- ✅ **Dynamic Options**: Callback-based option updates
- ✅ **Add New Functionality**: Allow users to add new items on the fly
- ✅ **Debounced Search**: Performance-optimized search with 300ms debounce
- ✅ **Loading States**: Built-in loading indicators
- ✅ **Error Handling**: Form validation and error display
- ✅ **Required Field Styling**: Visual indication for required fields
- ✅ **Custom Callbacks**: onChange, onValueChange hooks
- ✅ **Readonly Box**: Additional readonly field display
- ✅ **Clearable/Non-clearable**: Control over clear functionality

## Installation

The component is located at `src/components/UI/Forms/Dropdown/`.

## Basic Usage

### Simple Dropdown

```tsx
import { Dropdown } from '@/components/UI/Forms/Dropdown';
import { FormProvider, useForm } from 'react-hook-form';

const options = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
];

function MyForm() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <Dropdown
        name="country"
        preFetchedOptions={options}
        size="small"
        placeHolder="Select a country"
      />
    </FormProvider>
  );
}
```

### With Label and Validation

```tsx
<Dropdown
  name="country"
  preFetchedOptions={options}
  size="small"
  label="Country"
  placeHolder="Select a country"
  required
  withRequiredBorder
  helperText="This field is required"
/>
```

## Advanced Usage

### Dependent Dropdowns (Cascading)

```tsx
function CascadingDropdowns() {
  const methods = useForm();

  const getCities = (countryValue: any) => {
    if (!countryValue?.value) return [];
    return cityOptionsByCountry[countryValue.value] || [];
  };

  return (
    <FormProvider {...methods}>
      <Dropdown
        name="country"
        preFetchedOptions={countryOptions}
        size="small"
        label="Country"
        placeHolder="Select a country"
      />

      <Dropdown
        name="city"
        preFetchedOptions={[]}
        dynamicOptionCallback={getCities}
        dependency="country"
        size="small"
        label="City"
        placeHolder="Select a city"
      />
    </FormProvider>
  );
}
```

### Async Data Fetching

```tsx
<Dropdown
  name="users"
  isAsync
  apiHook={useGetUsers}
  getQueryParams={(keyword) => ({ search: keyword })}
  setFetchedOption={(data) =>
    data.map((user) => ({
      value: user.id,
      label: user.name,
    }))
  }
  size="small"
  label="Users"
  placeHolder="Search users..."
/>
```

### Add New Functionality

```tsx
function DropdownWithAddNew() {
  const [options, setOptions] = useState(initialOptions);

  const handleAddNew = (inputValue: string) => {
    const newOption = {
      value: inputValue.toLowerCase(),
      label: inputValue,
    };
    setOptions([...options, newOption]);
  };

  return (
    <Dropdown
      name="status"
      preFetchedOptions={options}
      size="small"
      addNewConfig={{
        enabled: true,
        buttonText: 'Add new status',
        onAddNew: handleAddNew,
      }}
    />
  );
}
```

### With Callbacks

```tsx
<Dropdown
  name="priority"
  preFetchedOptions={priorityOptions}
  size="small"
  onValueChange={(value, dependentFields, name) => {
    console.log('Selected:', value);
  }}
  onChange={(value, dependentFields) => {
    console.log('Changed:', value);
  }}
/>
```

## Props

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | **required** | Field name for form integration |
| `preFetchedOptions` | `DropdownOption[]` | `[]` | Array of options to display |
| `size` | `'small' \| 'medium' \| 'full'` | `'medium'` | Dropdown size (426px, auto, 922px) |
| `placeHolder` | `string` | `'Select an option'` | Placeholder text |
| `label` | `string` | - | Label text |
| `disabled` | `boolean` | `false` | Disable the dropdown |
| `required` | `boolean` | `false` | Mark as required |
| `error` | `FieldError` | - | Error object from react-hook-form |
| `helperText` | `string` | - | Helper text below dropdown |

### Advanced Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isAsync` | `boolean` | `false` | Enable async data fetching |
| `apiHook` | `IApiHook` | - | API hook for async data |
| `getQueryParams` | `(dep?, keyword?) => any` | - | Query params builder |
| `setFetchedOption` | `(data, name?) => DropdownOption[]` | - | Map API response to options |
| `dependency` | `string` | - | Parent field name for cascading |
| `dynamicOptionCallback` | `(value) => DropdownOption[]` | - | Dynamic options based on dependency |
| `onValueChange` | `(value, deps?, name?) => void` | - | Value change callback |
| `onChange` | `(value, deps?) => void` | - | Change callback |
| `addNewConfig` | `IAddNewConfig` | - | Add new item configuration |
| `disableClearable` | `boolean` | `false` | Prevent clearing selection |
| `withRequiredBorder` | `boolean` | `false` | Show required field border |
| `fullWidth` | `boolean` | `false` | Take full container width |

## Types

```typescript
interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface IAddNewConfig {
  enabled?: boolean;
  buttonText?: string;
  onAddNew?: (inputValue: string, name?: string, dependentFields?: string[]) => void;
}

interface IApiHook<T = any> {
  callApi: (params?: any) => void;
  callAsyncApi: (params?: any) => Promise<{ data?: T }>;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  data?: T;
}
```

## Styling

The component uses styled-components with Material-UI's `styled` API. Custom styles can be applied via:

1. **sx prop**: MUI's sx prop for custom styling
2. **className**: Custom CSS classes
3. **Theme**: Integrates with MUI theme

## Storybook

Comprehensive Storybook stories are available showcasing:
- Size variants
- States (disabled, error, loading)
- Dependent dropdowns
- Async loading
- Add new functionality
- Form integration
- Callbacks

Run Storybook to see all examples:
```bash
npm run storybook
```

## Best Practices

1. **Always wrap in FormProvider**: The component requires React Hook Form context
2. **Use unique names**: Each dropdown needs a unique name for form handling
3. **Type your options**: Use the `DropdownOption` interface for type safety
4. **Handle loading states**: Show loading indicators during async operations
5. **Validate dependencies**: Check dependency values before rendering dependent dropdowns

## Examples

See the `Dropdown.stories.tsx` file for comprehensive examples including:
- Basic usage
- Form validation
- Cascading dropdowns
- Async data loading
- Dynamic options
- Add new functionality
- Multiple dropdowns in forms

## Component Structure

```
Dropdown/
├── Dropdown.tsx          # Main component implementation
├── Dropdown.types.ts     # TypeScript type definitions
├── Dropdown.styles.ts    # Styled components
├── Dropdown.stories.tsx  # Storybook stories
├── index.ts              # Exports
└── README.md             # This file
```

## Dependencies

- `@mui/material`
- `react-hook-form`
- `react`

## License

Internal component for the Floow design system.

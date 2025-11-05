import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { DropdownOption } from './Dropdown.types';

// Sample dropdown options
const countryOptions: DropdownOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
];

const statusOptions: DropdownOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
];

const priorityOptions: DropdownOption[] = [
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' },
  { value: 'urgent', label: 'Urgent' },
];

const cityOptionsByCountry: Record<string, DropdownOption[]> = {
  us: [
    { value: 'ny', label: 'New York' },
    { value: 'la', label: 'Los Angeles' },
    { value: 'chicago', label: 'Chicago' },
  ],
  uk: [
    { value: 'london', label: 'London' },
    { value: 'manchester', label: 'Manchester' },
    { value: 'liverpool', label: 'Liverpool' },
  ],
  ca: [
    { value: 'toronto', label: 'Toronto' },
    { value: 'vancouver', label: 'Vancouver' },
    { value: 'montreal', label: 'Montreal' },
  ],
};

const meta = {
  title: 'UI/Forms/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A powerful, reusable dropdown component following the Floow design system. Features: React Hook Form integration, async data fetching, dependency management, add new functionality, and more. Maintains Figma design specifications (background: #FAFAFA, border: 1px solid #F5F5F5, border-radius: 6px).',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'full'],
      description: 'Size of the dropdown based on Figma specs (small: 426px, full: 922px)',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, dropdown is disabled',
    },
    isAsync: {
      control: 'boolean',
      description: 'If true, enables async data fetching',
    },
    disableClearable: {
      control: 'boolean',
      description: 'If true, prevents clearing the selection',
    },
    fullWidth: {
      control: 'boolean',
      description: 'If true, dropdown takes full width of container',
    },
    withRequiredBorder: {
      control: 'boolean',
      description: 'If true, shows required field border styling',
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

// Form wrapper for stories that need React Hook Form
const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

// Size variants - matching Figma specs
export const SmallSize: Story = {
  args: {
    name: 'country',
    preFetchedOptions: countryOptions,
    size: 'small',
    placeHolder: 'Select a country',
  },
  render: (args) => (
    <FormWrapper>
      <Dropdown {...args} />
    </FormWrapper>
  ),
};

export const MediumSize: Story = {
  args: {
    name: 'country',
    preFetchedOptions: countryOptions,
    size: 'medium',
    placeHolder: 'Select a country',
  },
  render: (args) => (
    <FormWrapper>
      <Dropdown {...args} />
    </FormWrapper>
  ),
};

export const FullSize: Story = {
  args: {
    name: 'country',
    preFetchedOptions: countryOptions,
    size: 'full',
    placeHolder: 'Select a country',
  },
  render: (args) => (
    <FormWrapper>
      <Dropdown {...args} />
    </FormWrapper>
  ),
};

// With label and required
export const WithLabel: Story = {
  args: {
    name: 'country',
    preFetchedOptions: countryOptions,
    size: 'small',
    label: 'Country',
    placeHolder: 'Select a country',
    required: true,
  },
  render: (args) => (
    <FormWrapper>
      <Dropdown {...args} />
    </FormWrapper>
  ),
};

// Required field with border
export const RequiredFieldBorder: Story = {
  args: {
    name: 'country',
    preFetchedOptions: countryOptions,
    size: 'small',
    label: 'Country',
    placeHolder: 'Select a country',
    required: true,
    withRequiredBorder: true,
    helperText: 'This field is required',
  },
  render: (args) => (
    <FormWrapper>
      <Dropdown {...args} />
    </FormWrapper>
  ),
};

// Error state
export const ErrorState: Story = {
  args: {
    name: 'country',
    preFetchedOptions: countryOptions,
    size: 'small',
    label: 'Country',
    placeHolder: 'Select a country',
  },
  render: () => {
    const ErrorExample = () => {
      const methods = useForm();
      const [showError] = useState(true);

      return (
        <FormProvider {...methods}>
          <Dropdown
            name="country"
            preFetchedOptions={countryOptions}
            size="small"
            label="Country"
            placeHolder="Select a country"
            error={showError ? ({ message: 'Please select a valid country', type: 'required' }) : undefined}
          />
        </FormProvider>
      );
    };
    return <ErrorExample />;
  },
};

// Disabled state
export const DisabledState: Story = {
  args: {
    name: 'country',
    preFetchedOptions: countryOptions,
    size: 'small',
    placeHolder: 'Select a country',
    disabled: true,
  },
  render: (args) => (
    <FormWrapper>
      <Dropdown {...args} />
    </FormWrapper>
  ),
};

// Prevent clearing
export const NonClearable: Story = {
  args: {
    name: 'status',
    preFetchedOptions: statusOptions,
    size: 'small',
    placeHolder: 'Select status',
    disableClearable: true,
    helperText: 'This dropdown cannot be cleared',
  },
  render: (args) => (
    <FormWrapper>
      <Dropdown {...args} />
    </FormWrapper>
  ),
};

// Full width example
export const FullWidth: Story = {
  args: {
    name: 'country',
    preFetchedOptions: countryOptions,
    placeHolder: 'Select a country',
    fullWidth: true,
  },
  render: (args) => (
    <FormWrapper>
      <Box sx={{ width: '100%', maxWidth: '600px' }}>
        <Dropdown {...args} />
      </Box>
    </FormWrapper>
  ),
};

// Dependent dropdowns (cascading)
export const DependentDropdowns: Story = {
  args: {
    name: 'country',
    preFetchedOptions: countryOptions,
  },
  render: () => {
    const DependentExample = () => {
      const methods = useForm();

      const getDynamicCities = (countryValue: unknown) => {
        if (!countryValue || typeof countryValue !== 'object' || !('value' in countryValue)) return [];
        const country = countryValue as { value: string; label: string };
        return cityOptionsByCountry[country.value] || [];
      };

      return (
        <FormProvider {...methods}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '500px' }}>
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
              dynamicOptionCallback={getDynamicCities}
              dependency="country"
              size="small"
              label="City"
              placeHolder="Select a city"
              helperText="Select a country first"
            />
          </Box>
        </FormProvider>
      );
    };
    return <DependentExample />;
  },
};

// Add new functionality
export const WithAddNew: Story = {
  args: {
    name: 'status',
    preFetchedOptions: statusOptions,
  },
  render: () => {
    const AddNewExample = () => {
      const methods = useForm();
      const [options, setOptions] = useState<DropdownOption[]>(statusOptions);

      const handleAddNew = (inputValue: string) => {
        const newValue = inputValue.toLowerCase().replace(/\s+/g, '-');
        const newOption: DropdownOption = {
          value: newValue,
          label: inputValue || 'New Status',
        };
        setOptions([...options, newOption]);
        alert(`Added new status: ${newOption.label}`);
      };

      return (
        <FormProvider {...methods}>
          <Dropdown
            name="status"
            preFetchedOptions={options}
            size="small"
            label="Status"
            placeHolder="Select or add status"
            addNewConfig={{
              enabled: true,
              buttonText: 'Add new status',
              onAddNew: handleAddNew,
            }}
          />
        </FormProvider>
      );
    };
    return <AddNewExample />;
  },
};

// Simulated async loading
export const AsyncLoading: Story = {
  args: {
    name: 'country',
    preFetchedOptions: [],
  },
  render: () => {
    const AsyncExample = () => {
      const methods = useForm();
      const [isLoading, setIsLoading] = useState(true);
      const [options, setOptions] = useState<DropdownOption[]>([]);

      useEffect(() => {
        // Simulate API call
        setTimeout(() => {
          setOptions(countryOptions);
          setIsLoading(false);
        }, 2000);
      }, []);

      return (
        <FormProvider {...methods}>
          <Dropdown
            name="country"
            preFetchedOptions={options}
            size="small"
            label="Country"
            placeHolder="Loading countries..."
            isPreFetchLoading={isLoading}
          />
        </FormProvider>
      );
    };
    return <AsyncExample />;
  },
};

// Form example with multiple dropdowns
export const CompleteFormExample: Story = {
  args: {
    name: 'country',
    preFetchedOptions: countryOptions,
  },
  render: () => {
    const FormExample = () => {
      const methods = useForm();

      const onSubmit = (data: Record<string, unknown>) => {
        console.log('Form submitted:', data);
        alert(JSON.stringify(data, null, 2));
      };

      return (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '600px' }}>
              <Dropdown
                name="country"
                preFetchedOptions={countryOptions}
                size="small"
                label="Country"
                placeHolder="Select a country"
                required
                withRequiredBorder
              />
              <Dropdown
                name="status"
                preFetchedOptions={statusOptions}
                size="small"
                label="Status"
                placeHolder="Select status"
                disableClearable
              />
              <Dropdown
                name="priority"
                preFetchedOptions={priorityOptions}
                size="small"
                label="Priority"
                placeHolder="Select priority"
                helperText="Choose the priority level"
              />
              <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
                Submit Form
              </button>
            </Box>
          </form>
        </FormProvider>
      );
    };
    return <FormExample />;
  },
};

// All sizes showcase
export const AllSizes: Story = {
  args: {
    name: 'country',
    preFetchedOptions: countryOptions,
  },
  render: () => (
    <FormWrapper>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'flex-start' }}>
        <Box>
          <h4 style={{ marginBottom: '0.5rem', color: '#666', fontSize: '14px' }}>Full Size (922px)</h4>
          <Dropdown name="country_full" preFetchedOptions={countryOptions} size="full" placeHolder="Select a country" />
        </Box>
        <Box>
          <h4 style={{ marginBottom: '0.5rem', color: '#666', fontSize: '14px' }}>Small Size (426px)</h4>
          <Dropdown name="country_small" preFetchedOptions={countryOptions} size="small" placeHolder="Select a country" />
        </Box>
        <Box>
          <h4 style={{ marginBottom: '0.5rem', color: '#666', fontSize: '14px' }}>Medium Size (auto)</h4>
          <Dropdown name="country_medium" preFetchedOptions={countryOptions} size="medium" placeHolder="Select a country" />
        </Box>
      </Box>
    </FormWrapper>
  ),
};

// Interactive callback example
export const WithCallbacks: Story = {
  args: {
    name: 'country',
    preFetchedOptions: countryOptions,
  },
  render: () => {
    const CallbackExample = () => {
      const methods = useForm();
      const [lastSelected, setLastSelected] = useState<string>('');

      const handleValueChange = (value: string | number) => {
        const selectedOption = countryOptions.find(opt => opt.value === value);
        setLastSelected(selectedOption?.label || 'None');
      };

      return (
        <FormProvider {...methods}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Dropdown
              name="country"
              preFetchedOptions={countryOptions}
              size="small"
              label="Country"
              placeHolder="Select a country"
              onValueChange={handleValueChange}
            />
            <Box sx={{ padding: '10px', background: '#f5f5f5', borderRadius: '6px', fontSize: '14px' }}>
              Last selected: <strong>{lastSelected || 'None'}</strong>
            </Box>
          </Box>
        </FormProvider>
      );
    };
    return <CallbackExample />;
  },
};

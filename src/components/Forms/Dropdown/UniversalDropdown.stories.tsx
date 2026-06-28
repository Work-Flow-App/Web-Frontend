import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { UniversalDropdown } from './UniversalDropdown';
import { useAsyncDropdown } from './useAsyncDropdown';
import type { DropdownOption } from './UniversalDropdown.types';

const meta: Meta<typeof UniversalDropdown> = {
  title: 'Forms/UniversalDropdown',
  component: UniversalDropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UniversalDropdown>;

// Sample data
const fruits: DropdownOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
  { label: 'Mango', value: 'mango' },
  { label: 'Grapes', value: 'grapes' },
  { label: 'Strawberry', value: 'strawberry' },
  { label: 'Watermelon', value: 'watermelon' },
];

// ========== BASIC EXAMPLES ==========

export const Basic: Story = {
  args: {
    name: 'fruit',
    label: 'Select a fruit',
    placeholder: 'Choose your favorite fruit',
    options: fruits,
  },
};

export const WithHelperText: Story = {
  args: {
    name: 'fruit',
    label: 'Select a fruit',
    placeholder: 'Choose your favorite fruit',
    options: fruits,
    helperText: 'Pick your favorite fruit from the list',
  },
};

export const Required: Story = {
  args: {
    name: 'fruit',
    label: 'Select a fruit',
    placeholder: 'Choose your favorite fruit',
    options: fruits,
    required: true,
    helperText: 'This field is required',
  },
};

export const WithError: Story = {
  args: {
    name: 'fruit',
    label: 'Select a fruit',
    placeholder: 'Choose your favorite fruit',
    options: fruits,
    error: { message: 'Please select a fruit' },
  },
};

export const Disabled: Story = {
  args: {
    name: 'fruit',
    label: 'Select a fruit',
    placeholder: 'Choose your favorite fruit',
    options: fruits,
    disabled: true,
  },
};

// ========== SIZE VARIANTS ==========

export const SizeSmall: Story = {
  args: {
    name: 'fruit',
    label: 'Small dropdown',
    options: fruits,
    size: 'small',
  },
};

export const SizeMedium: Story = {
  args: {
    name: 'fruit',
    label: 'Medium dropdown',
    options: fruits,
    size: 'medium',
  },
};

export const SizeFull: Story = {
  args: {
    name: 'fruit',
    label: 'Full width dropdown',
    options: fruits,
    size: 'full',
  },
};

// ========== CONTROLLED EXAMPLE ==========

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<DropdownOption | null>(fruits[0]);

    return (
      <div style={{ width: 400 }}>
        <UniversalDropdown
          name="controlled-fruit"
          label="Controlled Dropdown"
          options={fruits}
          value={value}
          onChange={(val, option) => {
            console.log('Selected:', val, option);
            setValue(option);
          }}
        />
        <p style={{ marginTop: 16 }}>Selected: {value?.label || 'None'}</p>
      </div>
    );
  },
};

// ========== SEARCHABLE EXAMPLE ==========

export const Searchable: Story = {
  args: {
    name: 'searchable-fruit',
    label: 'Searchable Dropdown',
    placeholder: 'Type to search...',
    options: fruits,
    searchable: true,
  },
};

// ========== CLEARABLE EXAMPLES ==========

export const Clearable: Story = {
  args: {
    name: 'clearable-fruit',
    label: 'Clearable Dropdown',
    options: fruits,
    clearable: true,
  },
};

export const NotClearable: Story = {
  args: {
    name: 'not-clearable-fruit',
    label: 'Not Clearable Dropdown',
    options: fruits,
    clearable: false,
  },
};

// ========== ASYNC EXAMPLE ==========

export const AsyncDropdown: Story = {
  render: () => {
    const { options, loading, onSearch } = useAsyncDropdown({
      fetchFn: async (searchTerm) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const allUsers = [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Smith' },
          { id: 3, name: 'Bob Johnson' },
          { id: 4, name: 'Alice Williams' },
          { id: 5, name: 'Charlie Brown' },
        ];

        if (searchTerm) {
          return allUsers.filter((u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return allUsers;
      },
      transformFn: (users) => users.map((u) => ({ label: u.name, value: u.id })),
      fetchOnMount: true,
    });

    return (
      <div style={{ width: 400 }}>
        <UniversalDropdown
          name="async-users"
          label="Search Users"
          placeholder="Type to search users..."
          options={options}
          loading={loading}
          onSearch={onSearch}
        />
      </div>
    );
  },
};

// ========== REACT HOOK FORM INTEGRATION ==========

export const WithReactHookForm: Story = {
  render: () => {
    const methods = useForm({
      defaultValues: {
        fruit: null,
        vegetable: null,
      },
    });

    const onSubmit = (data: any) => {
      console.log('Form submitted:', data);
      alert(`Selected: ${data.fruit?.label || 'None'}`);
    };

    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} style={{ width: 400 }}>
          <UniversalDropdown
            name="fruit"
            label="Select a fruit"
            options={fruits}
            useFormIntegration
            required
          />

          <button type="submit" style={{ marginTop: 16, padding: '8px 16px' }}>
            Submit
          </button>
        </form>
      </FormProvider>
    );
  },
};

// ========== CUSTOM RENDERING ==========

export const CustomOptionRendering: Story = {
  render: () => {
    const customOptions: DropdownOption[] = [
      { label: 'High Priority', value: 'high', color: 'red' },
      { label: 'Medium Priority', value: 'medium', color: 'orange' },
      { label: 'Low Priority', value: 'low', color: 'green' },
    ];

    return (
      <div style={{ width: 400 }}>
        <UniversalDropdown
          name="priority"
          label="Select Priority"
          options={customOptions}
          renderOption={(props, option) => (
            <li {...props} key={option.value}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: option.color,
                  }}
                />
                <span>{option.label}</span>
              </div>
            </li>
          )}
        />
      </div>
    );
  },
};

// ========== PRIMITIVE VALUES ==========

export const PrimitiveValues: Story = {
  render: () => {
    const primitiveOptions = ['Red', 'Green', 'Blue', 'Yellow', 'Purple'];

    return (
      <div style={{ width: 400 }}>
        <UniversalDropdown
          name="color"
          label="Select a color"
          options={primitiveOptions}
          onChange={(value) => console.log('Selected color:', value)}
        />
      </div>
    );
  },
};

// ========== LOADING STATE ==========

export const LoadingState: Story = {
  args: {
    name: 'loading',
    label: 'Loading Dropdown',
    options: [],
    loading: true,
    loadingText: 'Fetching options...',
  },
};

// ========== NO OPTIONS ==========

export const NoOptions: Story = {
  args: {
    name: 'empty',
    label: 'Empty Dropdown',
    options: [],
    noOptionsText: 'No items found',
  },
};

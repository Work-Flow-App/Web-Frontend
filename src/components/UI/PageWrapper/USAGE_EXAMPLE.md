# PageWrapper Usage Examples

## Complete Example with All Features

```tsx
import { PageWrapper } from '@/components/UI';
import { useState } from 'react';

const AddMemberIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const WorkersPage = () => {
  const [selectedMemberType, setSelectedMemberType] = useState('all');
  const [searchValue, setSearchValue] = useState('');

  const handleAddMember = () => {
    // Open add member modal
    console.log('Add member clicked');
  };

  const handleFilterClick = () => {
    // Open filter drawer/modal
    console.log('Filter clicked');
  };

  const dropdownOptions = [
    { label: 'All Members', value: 'all' },
    { label: 'Active Members', value: 'active' },
    { label: 'Inactive Members', value: 'inactive' },
    { label: 'Pending Members', value: 'pending' },
  ];

  return (
    <PageWrapper
      title="All Workers"
      description="Manage worker details, roles, and assignments in one place."
      actions={[
        {
          label: 'Add Member',
          icon: <AddMemberIcon />,
          onClick: handleAddMember,
          variant: 'contained',
          color: 'primary',
        },
      ]}
      dropdownOptions={dropdownOptions}
      dropdownValue={selectedMemberType}
      dropdownPlaceholder="All Member"
      onDropdownChange={(value) => setSelectedMemberType(value as string)}
      showSearch
      searchPlaceholder="Search"
      onSearchChange={setSearchValue}
      onSearch={(value) => console.log('Search submitted:', value)}
      showFilter
      onFilterClick={handleFilterClick}
      maxWidth={1840}
    >
      <WorkersTable
        memberType={selectedMemberType}
        searchValue={searchValue}
      />
    </PageWrapper>
  );
};
```

## Layout Order (Left to Right)

Based on the Figma design, the header elements are arranged as:

**Left Side:**
- Title and Description (stacked vertically)

**Right Side (in order):**
1. **Add Member Button** (or any action buttons)
2. **All Member Dropdown** (if `dropdownOptions` provided)
3. **headerExtra** (custom components)
4. **Search Input** (if `showSearch` is true)
5. **Filter Icon** (if `showFilter` is true)

## Minimal Example

```tsx
<PageWrapper
  title="All Workers"
  description="Manage worker details, roles, and assignments in one place."
>
  <YourContent />
</PageWrapper>
```

## With Dropdown Only

```tsx
<PageWrapper
  title="All Workers"
  description="Manage worker details, roles, and assignments in one place."
  dropdownOptions={[
    { label: 'All Members', value: 'all' },
    { label: 'Active Members', value: 'active' },
  ]}
  onDropdownChange={(value) => console.log('Selected:', value)}
>
  <YourContent />
</PageWrapper>
```

## With Multiple Action Buttons

```tsx
<PageWrapper
  title="Company Dashboard"
  description="Overview of all company data and metrics."
  actions={[
    {
      label: 'Export',
      onClick: handleExport,
      variant: 'outlined',
      color: 'secondary',
    },
    {
      label: 'Add Member',
      icon: <AddIcon />,
      onClick: handleAddMember,
      variant: 'contained',
      color: 'primary',
    },
  ]}
>
  <YourContent />
</PageWrapper>
```

## With Custom Header Content

If you need to add custom components (e.g., a custom dropdown or other controls), use `headerExtra`:

```tsx
<PageWrapper
  title="All Workers"
  description="Manage worker details, roles, and assignments in one place."
  actions={[
    {
      label: 'Add Member',
      icon: <AddIcon />,
      onClick: handleAddMember,
    },
  ]}
  headerExtra={<YourCustomComponent />}
  showSearch
  showFilter
  onFilterClick={handleFilterClick}
>
  <YourContent />
</PageWrapper>
```

## Props Reference

### PageWrapperProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | Page title |
| `description` | `string` | - | Page description |
| `children` | `ReactNode` | Required | Page content |
| `actions` | `PageAction[]` | `[]` | Action buttons |
| `dropdownOptions` | `DropdownOption[]` | - | Dropdown options (from your Dropdown component) |
| `dropdownValue` | `string \| number` | - | Selected dropdown value |
| `dropdownPlaceholder` | `string` | `'All Member'` | Dropdown placeholder |
| `onDropdownChange` | `(value: string \| number) => void` | - | Dropdown change callback |
| `showSearch` | `boolean` | `false` | Show search input |
| `searchPlaceholder` | `string` | `'Search'` | Search placeholder |
| `onSearchChange` | `(value: string) => void` | - | Search input change callback |
| `onSearch` | `(value: string) => void` | - | Search submit callback (Enter key) |
| `showFilter` | `boolean` | `false` | Show filter button |
| `onFilterClick` | `() => void` | - | Filter button click callback |
| `headerExtra` | `ReactNode` | - | Additional header content |
| `maxWidth` | `string \| number` | `'100%'` | Max width of page container |

### DropdownOption (from your Dropdown component)

```tsx
interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}
```

### PageAction

```tsx
interface PageAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error';
  disabled?: boolean;
}
```

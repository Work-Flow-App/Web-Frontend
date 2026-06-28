# PageWrapper Component

A reusable page wrapper component with built-in header, search, filter, and action buttons support.

## Features

- **Flexible Header**: Title, description, and custom header content
- **Search Integration**: Built-in search component with callbacks
- **Filter Support**: Optional filter button with custom icon
- **Action Buttons**: Support for multiple action buttons with icons
- **Context API**: Manage page state dynamically using context
- **Fully Typed**: Complete TypeScript support
- **Themed**: Uses Material-UI theme for consistent styling

## Basic Usage

```tsx
import { PageWrapper } from '@/components/UI';

export const WorkersPage = () => {
  return (
    <PageWrapper
      title="All Workers"
      description="Manage worker details, roles, and assignments in one place."
    >
      {/* Your page content here */}
      <YourTableComponent />
    </PageWrapper>
  );
};
```

## With Search

```tsx
import { PageWrapper } from '@/components/UI';

export const WorkersPage = () => {
  const handleSearchChange = (value: string) => {
    console.log('Search value:', value);
  };

  const handleSearch = (value: string) => {
    console.log('Search submitted:', value);
  };

  return (
    <PageWrapper
      title="All Workers"
      description="Manage worker details, roles, and assignments in one place."
      showSearch
      searchPlaceholder="Search workers..."
      onSearchChange={handleSearchChange}
      onSearch={handleSearch}
    >
      <YourTableComponent />
    </PageWrapper>
  );
};
```

## With Filter

```tsx
import { PageWrapper } from '@/components/UI';

export const WorkersPage = () => {
  const handleFilterClick = () => {
    // Open filter modal or drawer
    console.log('Filter clicked');
  };

  return (
    <PageWrapper
      title="All Workers"
      description="Manage worker details, roles, and assignments in one place."
      showSearch
      showFilter
      onFilterClick={handleFilterClick}
    >
      <YourTableComponent />
    </PageWrapper>
  );
};
```

## With Actions

```tsx
import { PageWrapper } from '@/components/UI';

const AddMemberIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const WorkersPage = () => {
  const handleAddMember = () => {
    // Open add member modal
    console.log('Add member clicked');
  };

  return (
    <PageWrapper
      title="All Workers"
      description="Manage worker details, roles, and assignments in one place."
      showSearch
      showFilter
      onFilterClick={() => console.log('Filter clicked')}
      actions={[
        {
          label: 'Add Member',
          icon: <AddMemberIcon />,
          onClick: handleAddMember,
          variant: 'primary',
        },
      ]}
    >
      <YourTableComponent />
    </PageWrapper>
  );
};
```

## Full Example

```tsx
import { PageWrapper } from '@/components/UI';
import { useState } from 'react';

export const WorkersPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleAddMember = () => {
    // Open modal using your modal context
    setGlobalModalOuterProps({
      isOpen: true,
      children: <AddMemberForm />,
    });
  };

  const handleExport = () => {
    // Export logic
    console.log('Exporting data...');
  };

  return (
    <PageWrapper
      title="All Workers"
      description="Manage worker details, roles, and assignments in one place."
      showSearch
      searchPlaceholder="Search"
      onSearchChange={setSearchValue}
      onSearch={(value) => console.log('Search submitted:', value)}
      showFilter
      onFilterClick={() => setIsFilterOpen(true)}
      actions={[
        {
          label: 'Export',
          onClick: handleExport,
          variant: 'outlined',
        },
        {
          label: 'Add Member',
          icon: <AddIcon />,
          onClick: handleAddMember,
          variant: 'primary',
        },
      ]}
      maxWidth={1840}
    >
      <WorkersTable searchValue={searchValue} />
      <FilterDrawer open={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </PageWrapper>
  );
};
```

## Using Context API

For dynamic updates to the page wrapper (e.g., changing title from child components):

```tsx
import { PageWrapperProvider, usePageWrapperContext } from '@/components/UI';

// In your app root or page layout
export const WorkersLayout = ({ children }) => {
  return (
    <PageWrapperProvider initialTitle="All Workers" initialDescription="Manage workers">
      {children}
    </PageWrapperProvider>
  );
};

// In child components
const WorkerDetails = () => {
  const { setTitle, setDescription, addAction } = usePageWrapperContext();

  useEffect(() => {
    setTitle('Worker Details');
    setDescription('Viewing detailed information');

    addAction({
      label: 'Edit',
      onClick: handleEdit,
      variant: 'primary',
    });

    return () => {
      // Cleanup on unmount
      clearActions();
    };
  }, []);

  return <div>Worker details content...</div>;
};
```

## Props

### PageWrapperProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | Page title |
| `description` | `string` | - | Page description text |
| `children` | `ReactNode` | Required | Page content |
| `actions` | `PageAction[]` | `[]` | Action buttons to display |
| `showSearch` | `boolean` | `false` | Show search input |
| `searchPlaceholder` | `string` | `'Search'` | Search input placeholder |
| `onSearchChange` | `(value: string) => void` | - | Search input change callback |
| `onSearch` | `(value: string) => void` | - | Search submit callback (Enter key) |
| `showFilter` | `boolean` | `false` | Show filter button |
| `onFilterClick` | `() => void` | - | Filter button click callback |
| `headerExtra` | `ReactNode` | - | Additional content in header |
| `maxWidth` | `string \| number` | `'100%'` | Maximum width of page container |

### PageAction

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | Required | Button label |
| `icon` | `ReactNode` | - | Icon to display before label |
| `onClick` | `() => void` | Required | Click handler |
| `variant` | `'primary' \| 'secondary' \| 'outlined'` | `'primary'` | Button variant |
| `disabled` | `boolean` | `false` | Disable button |

## Context API

### usePageWrapperContext

```tsx
const {
  title,              // Current title
  description,        // Current description
  setTitle,           // Update title
  setDescription,     // Update description
  addAction,          // Add an action button
  removeAction,       // Remove action by label
  clearActions,       // Remove all actions
  setHeaderExtra,     // Set extra header content
} = usePageWrapperContext();
```

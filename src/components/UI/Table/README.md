# Table Component

A comprehensive, accessible table component with sorting, selection, pagination, and custom rendering capabilities. Built with Material-UI and following the Floow design system.

## Features

- ✅ **Row Selection** - Single or multi-row selection with checkboxes
- ✅ **Sorting** - Column-based sorting with visual indicators
- ✅ **Pagination** - Built-in pagination component with customizable navigation
- ✅ **Custom Rendering** - Flexible cell rendering with custom components
- ✅ **Action Menus** - Row-level action buttons
- ✅ **Loading States** - Built-in loading overlay
- ✅ **Empty States** - Customizable empty state messages
- ✅ **Responsive** - Adapts to different screen sizes
- ✅ **Accessible** - Full keyboard navigation and ARIA support
- ✅ **Type-Safe** - Full TypeScript support with generics

## Installation

The Table component is part of the UI component library. No additional installation is required.

## Basic Usage

```tsx
import Table from '@/components/UI/Table';
import { TableColumn } from '@/components/UI/Table';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const columns: TableColumn<User>[] = [
  {
    id: 'name',
    label: 'Name',
    accessor: 'name',
    sortable: true,
  },
  {
    id: 'email',
    label: 'Email',
    accessor: 'email',
  },
  {
    id: 'role',
    label: 'Role',
    accessor: 'role',
    sortable: true,
  },
];

const data: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Manager' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Worker' },
];

function MyTable() {
  return <Table columns={columns} data={data} />;
}
```

## Advanced Usage

### With Selection and Sorting

```tsx
import { useState } from 'react';
import Table from '@/components/UI/Table';
import { SortConfig } from '@/components/UI/Table';

function AdvancedTable() {
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    columnId: '',
    direction: null,
  });

  return (
    <Table
      columns={columns}
      data={data}
      selectable
      selectedRows={selectedRows}
      onSelectionChange={setSelectedRows}
      sortable
      sortConfig={sortConfig}
      onSortChange={setSortConfig}
    />
  );
}
```

### With Pagination

```tsx
import { useState } from 'react';
import Table, { Pagination } from '@/components/UI/Table';

function PaginatedTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <Table columns={columns} data={paginatedData} />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(data.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
```

### With Custom Cell Rendering

```tsx
import { StatusPill, AvatarCell, Avatar, MemberInfo, MemberName, MemberEmail } from '@/components/UI/Table';

const columns: TableColumn<MemberRow>[] = [
  {
    id: 'member',
    label: 'Member',
    render: (row) => (
      <AvatarCell>
        <Avatar>{row.member.initials}</Avatar>
        <MemberInfo>
          <MemberName>{row.member.name}</MemberName>
          <MemberEmail>{row.member.email}</MemberEmail>
        </MemberInfo>
      </AvatarCell>
    ),
  },
  {
    id: 'status',
    label: 'Status',
    render: (row) => (
      <StatusPill status={row.status}>{row.status}</StatusPill>
    ),
  },
];
```

### With Action Menu

```tsx
function TableWithActions() {
  const handleActionClick = (row: User, event: React.MouseEvent) => {
    console.log('Action clicked for:', row);
    // Show menu, modal, etc.
  };

  return (
    <Table
      columns={columns}
      data={data}
      showActions
      onActionClick={handleActionClick}
    />
  );
}
```

## Props

### Table Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `TableColumn<T>[]` | **required** | Array of column configurations |
| `data` | `T[]` | **required** | Array of data rows |
| `selectable` | `boolean` | `false` | Enable row selection with checkboxes |
| `selectedRows` | `(string \| number)[]` | `[]` | Array of selected row IDs (controlled) |
| `onSelectionChange` | `(selectedIds: (string \| number)[]) => void` | - | Callback when row selection changes |
| `sortable` | `boolean` | `false` | Enable sorting functionality |
| `sortConfig` | `SortConfig` | - | Current sort configuration |
| `onSortChange` | `(config: SortConfig) => void` | - | Callback when sort changes |
| `showActions` | `boolean` | `false` | Enable row actions menu |
| `renderActions` | `(row: T) => ReactNode` | - | Custom render function for row actions |
| `onActionClick` | `(row: T, event: React.MouseEvent) => void` | - | Callback when row action menu is clicked |
| `loading` | `boolean` | `false` | Loading state |
| `emptyMessage` | `string` | `'No data available'` | Empty state message |
| `width` | `string` | `'1840px'` | Table container width |
| `className` | `string` | - | Custom className for the table container |

### TableColumn Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | **required** | Unique identifier for the column |
| `label` | `string` | **required** | Column header label |
| `accessor` | `keyof T` | - | Key to access data in the row object |
| `render` | `(row: T) => ReactNode` | - | Custom render function for cell content |
| `sortable` | `boolean` | `false` | Enable sorting for this column |
| `width` | `string` | - | Column width (e.g., '200px', '20%', 'auto') |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Text alignment for the column |

### Pagination Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | **required** | Current page number (1-indexed) |
| `totalPages` | `number` | **required** | Total number of pages |
| `onPageChange` | `(page: number) => void` | **required** | Callback when page changes |
| `maxPageButtons` | `number` | `5` | Number of page buttons to show |
| `showPrevNext` | `boolean` | `true` | Show previous/next buttons |
| `showFirstLast` | `boolean` | `false` | Show first/last page buttons |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | - | Custom className |

## Styled Components

The Table component exports several styled components for custom rendering:

### Status Components
- `StatusPill` - Status badge with predefined colors (active, deactivated, pending)

### Avatar Components
- `AvatarCell` - Container for avatar and member info
- `Avatar` - Circular avatar with initials
- `MemberInfo` - Container for member name and email
- `MemberName` - Member name text
- `MemberEmail` - Member email text

### Date Components
- `DateText` - Container for date information
- `DateMain` - Main date text
- `DateSub` - Subtitle date text

### Action Components
- `ActionButton` - Button for row actions
- `CustomCheckbox` - Custom checkbox component

## Icons

The Table component includes custom SVG icons:

- `SortIcon` - Sort indicator icon
- `MoreOptionsIcon` - Three-dot menu icon
- `ChevronLeftIcon` - Left arrow for pagination
- `ChevronRightIcon` - Right arrow for pagination
- `EllipsisIcon` - Ellipsis for pagination

All icons accept the following props:
- `width?: number` - Icon width (default: 16)
- `height?: number` - Icon height (default: 16)
- `color?: string` - Icon color
- `className?: string` - Custom className

## Accessibility

The Table component is fully accessible and includes:

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **ARIA Labels**: Proper ARIA labels for screen readers
- **Role Attributes**: Correct role attributes for table structure
- **Focus Management**: Visible focus indicators
- **Checkbox States**: Support for checked, unchecked, and indeterminate states

### Keyboard Shortcuts

- `Tab` / `Shift+Tab` - Navigate between interactive elements
- `Enter` / `Space` - Activate checkboxes and action buttons
- `Click` - Sort columns (when sortable)

## Examples

### Team Members Table (from Figma)

```tsx
import Table, { Pagination } from '@/components/UI/Table';
import { StatusPill, AvatarCell, Avatar, MemberInfo, MemberName, MemberEmail, DateText, DateMain, DateSub } from '@/components/UI/Table';

interface MemberRow {
  id: number;
  addedOn: string;
  addedTime: string;
  member: {
    name: string;
    email: string;
    initials: string;
  };
  jobAssignments: number;
  role: string;
  status: 'active' | 'deactivated' | 'pending';
}

const columns: TableColumn<MemberRow>[] = [
  {
    id: 'addedOn',
    label: 'Added on',
    sortable: true,
    width: '200px',
    render: (row) => (
      <DateText>
        <DateMain>{row.addedOn}</DateMain>
        <DateSub>{row.addedTime}</DateSub>
      </DateText>
    ),
  },
  {
    id: 'member',
    label: 'Member',
    sortable: true,
    width: '300px',
    render: (row) => (
      <AvatarCell>
        <Avatar>{row.member.initials}</Avatar>
        <MemberInfo>
          <MemberName>{row.member.name}</MemberName>
          <MemberEmail>{row.member.email}</MemberEmail>
        </MemberInfo>
      </AvatarCell>
    ),
  },
  {
    id: 'jobAssignments',
    label: 'Job Assignments',
    accessor: 'jobAssignments',
    sortable: true,
    width: '300px',
  },
  {
    id: 'role',
    label: 'Role',
    accessor: 'role',
    sortable: true,
    width: '300px',
  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
    width: '264px',
    render: (row) => <StatusPill status={row.status}>{row.status}</StatusPill>,
  },
];

function TeamMembersTable() {
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    columnId: '',
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div>
      <Table
        columns={columns}
        data={members}
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        sortable
        sortConfig={sortConfig}
        onSortChange={setSortConfig}
        showActions
        onActionClick={(row) => console.log('Action:', row)}
      />
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
```

## Styling

The Table component uses Material-UI's `styled` API with Emotion. All components follow the Floow design system.

### Theme Integration

The component integrates with the MUI theme:

```tsx
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Table {...props} />
    </ThemeProvider>
  );
}
```

### Custom Styling

You can customize the table using the `className` prop or by wrapping it in a styled component:

```tsx
import styled from '@emotion/styled';
import Table from '@/components/UI/Table';

const CustomTable = styled(Table)`
  /* Your custom styles */
`;
```

## Best Practices

1. **Use TypeScript generics** for type-safe data access:
   ```tsx
   const columns: TableColumn<User>[] = [...];
   ```

2. **Memoize complex render functions** to avoid unnecessary re-renders:
   ```tsx
   const columns = useMemo(() => [...], [dependencies]);
   ```

3. **Handle sorting and pagination on the backend** for large datasets:
   ```tsx
   // Fetch data based on current page and sort config
   const { data } = useQuery(['users', currentPage, sortConfig], () =>
     fetchUsers({ page: currentPage, sort: sortConfig })
   );
   ```

4. **Use controlled components** for state management:
   ```tsx
   <Table
     selectedRows={selectedRows}
     onSelectionChange={setSelectedRows}
   />
   ```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Related Components

- [Button](../Button/README.md)
- [Dropdown](../Dropdown/README.md)
- [Input](../Input/README.md)

## Contributing

When making changes to the Table component, ensure you:

1. Update TypeScript types
2. Update Storybook stories
3. Update this README
4. Add tests for new functionality
5. Follow the existing code style

## License

Internal component for the WorkFlow application.

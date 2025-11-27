# PageWrapper - Real World Examples

The PageWrapper is fully flexible - each page can have completely different configurations with different buttons, icons, dropdowns, and any combination of props.

## Example 1: Workers Page

```tsx
import { PageWrapper } from '@/components/UI';

const AddMemberIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2v16M2 10h16" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const WorkersPage = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [searchValue, setSearchValue] = useState('');

  return (
    <PageWrapper
      title="All Workers"
      description="Manage worker details, roles, and assignments in one place."
      actions={[
        {
          label: 'Add Member',
          icon: <AddMemberIcon />,
          onClick: () => openAddMemberModal(),
          variant: 'contained',
          color: 'primary',
        },
      ]}
      dropdownOptions={[
        { label: 'All Members', value: 'all' },
        { label: 'Active Members', value: 'active' },
        { label: 'Inactive Members', value: 'inactive' },
      ]}
      dropdownValue={selectedType}
      onDropdownChange={setSelectedType}
      showSearch
      onSearchChange={setSearchValue}
      showFilter
      onFilterClick={() => openFilterDrawer()}
    >
      <WorkersTable type={selectedType} search={searchValue} />
    </PageWrapper>
  );
};
```

## Example 2: Company Page (Different Icon, No Dropdown)

```tsx
import { PageWrapper } from '@/components/UI';

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="3" y="4" width="14" height="14" stroke="currentColor" strokeWidth="2" />
    <line x1="7" y1="8" x2="7" y2="8" stroke="currentColor" strokeWidth="2" />
    <line x1="13" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const CompanyPage = () => {
  return (
    <PageWrapper
      title="Companies"
      description="Manage all registered companies and their details."
      actions={[
        {
          label: 'Add Company',
          icon: <BuildingIcon />,
          onClick: () => openAddCompanyModal(),
          variant: 'contained',
          color: 'primary',
        },
      ]}
      showSearch
      searchPlaceholder="Search companies..."
    >
      <CompanyTable />
    </PageWrapper>
  );
};
```

## Example 3: Reports Page (Multiple Actions, Different Icons)

```tsx
import { PageWrapper } from '@/components/UI';

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2v12M6 10l4 4 4-4M2 18h16" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const ShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="5" cy="10" r="2" stroke="currentColor" strokeWidth="2" />
    <circle cx="15" cy="5" r="2" stroke="currentColor" strokeWidth="2" />
    <circle cx="15" cy="15" r="2" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M2 10a8 8 0 1 1 0 .1" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const ReportsPage = () => {
  return (
    <PageWrapper
      title="Reports & Analytics"
      description="View and export comprehensive reports."
      actions={[
        {
          label: 'Refresh',
          icon: <RefreshIcon />,
          onClick: () => refreshData(),
          variant: 'outlined',
          color: 'secondary',
        },
        {
          label: 'Share',
          icon: <ShareIcon />,
          onClick: () => shareReport(),
          variant: 'outlined',
          color: 'secondary',
        },
        {
          label: 'Export',
          icon: <DownloadIcon />,
          onClick: () => exportReport(),
          variant: 'contained',
          color: 'primary',
        },
      ]}
      dropdownOptions={[
        { label: 'Last 7 Days', value: '7d' },
        { label: 'Last 30 Days', value: '30d' },
        { label: 'Last Quarter', value: '90d' },
        { label: 'Last Year', value: '365d' },
      ]}
      dropdownValue="30d"
      dropdownPlaceholder="Time Period"
      showFilter
      onFilterClick={() => openAdvancedFilters()}
    >
      <ReportsContent />
    </PageWrapper>
  );
};
```

## Example 4: Projects Page (Custom Header Extra)

```tsx
import { PageWrapper } from '@/components/UI';
import { Badge, IconButton } from '@mui/material';

const AddIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const NotificationButton = () => (
  <IconButton>
    <Badge badgeContent={4} color="error">
      <BellIcon />
    </Badge>
  </IconButton>
);

export const ProjectsPage = () => {
  return (
    <PageWrapper
      title="Projects"
      description="Track and manage all ongoing projects."
      actions={[
        {
          label: 'New Project',
          icon: <AddIcon />,
          onClick: () => createProject(),
          variant: 'contained',
          color: 'primary',
        },
      ]}
      dropdownOptions={[
        { label: 'All Projects', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'On Hold', value: 'on_hold' },
      ]}
      headerExtra={<NotificationButton />}
      showSearch
      showFilter
      onFilterClick={() => openFilters()}
    >
      <ProjectsGrid />
    </PageWrapper>
  );
};
```

## Example 5: Minimal Page (Just Title and Content)

```tsx
import { PageWrapper } from '@/components/UI';

export const SettingsPage = () => {
  return (
    <PageWrapper
      title="Settings"
      description="Configure your application preferences."
    >
      <SettingsForm />
    </PageWrapper>
  );
};
```

## Example 6: Activities Page (No Actions, Just Dropdown and Search)

```tsx
import { PageWrapper } from '@/components/UI';

export const ActivitiesPage = () => {
  return (
    <PageWrapper
      title="Recent Activities"
      description="View all recent activities and events."
      dropdownOptions={[
        { label: 'All Activities', value: 'all' },
        { label: 'User Actions', value: 'user' },
        { label: 'System Events', value: 'system' },
        { label: 'Errors', value: 'errors' },
      ]}
      showSearch
      searchPlaceholder="Search activities..."
    >
      <ActivityTimeline />
    </PageWrapper>
  );
};
```

## Example 7: Custom Dropdown per Page

Each page can have its own unique dropdown options:

```tsx
// Workers Page Dropdown
dropdownOptions={[
  { label: 'All Members', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]}

// Reports Page Dropdown (completely different)
dropdownOptions={[
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
]}

// Projects Page Dropdown (different again)
dropdownOptions={[
  { label: 'By Priority', value: 'priority' },
  { label: 'By Status', value: 'status' },
  { label: 'By Team', value: 'team' },
  { label: 'By Date', value: 'date' },
]}
```

## Adding New Props

The PageWrapper is designed to be extended. You can easily add new props:

### Example: Adding a Date Range Picker

1. Update `PageWrapper.types.ts`:
```tsx
export interface PageWrapperProps {
  // ... existing props
  showDatePicker?: boolean;
  dateRange?: { start: Date; end: Date };
  onDateChange?: (range: { start: Date; end: Date }) => void;
}
```

2. Update `PageWrapper.tsx`:
```tsx
<S.HeaderRight>
  {/* existing components */}

  {showDatePicker && (
    <DateRangePicker
      value={dateRange}
      onChange={onDateChange}
    />
  )}
</S.HeaderRight>
```

### Example: Adding a View Toggle

1. Add to types:
```tsx
export interface PageWrapperProps {
  // ... existing props
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  showViewToggle?: boolean;
}
```

2. Add to component:
```tsx
{showViewToggle && (
  <ViewToggle mode={viewMode} onChange={onViewModeChange} />
)}
```

## Key Principles

1. **Each page is independent** - Configure exactly what you need
2. **Any combination works** - Mix and match any props
3. **Easy to extend** - Add new props without breaking existing pages
4. **Fully typed** - TypeScript ensures correct usage
5. **Responsive by default** - All configurations are responsive

## Prop Priority (Order in Header)

The components appear in this order (left to right):
1. Actions (buttons)
2. headerExtra (custom components)
3. Dropdown
4. Search
5. Filter

You can show/hide any of these on any page!

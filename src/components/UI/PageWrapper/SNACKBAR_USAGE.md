# PageWrapper with Snackbar - Usage Guide

The PageWrapper now includes built-in Snackbar/notification functionality. Any component inside PageWrapper can show notifications easily using the `useSnackbar` hook.

## Basic Usage

```tsx
import { PageWrapper, useSnackbar } from '@/components/UI';

const WorkersTable = () => {
  const { showSuccess, showError, showWarning, showInfo } = useSnackbar();

  const handleDelete = async (id: string) => {
    try {
      await deleteWorker(id);
      showSuccess('Worker deleted successfully');
    } catch (error) {
      showError('Failed to delete worker');
    }
  };

  return (
    <table>
      {/* Your table content */}
      <button onClick={() => handleDelete('123')}>Delete</button>
    </table>
  );
};

export const WorkersPage = () => {
  return (
    <PageWrapper
      title="All Workers"
      description="Manage worker details, roles, and assignments in one place."
    >
      <WorkersTable />
    </PageWrapper>
  );
};
```

## Available Hook Methods

The `useSnackbar` hook provides these methods:

```tsx
const {
  showSuccess,  // Show success notification (green)
  showError,    // Show error notification (red)
  showWarning,  // Show warning notification (yellow)
  showInfo,     // Show info notification (blue)
  showSnackbar, // Generic method with variant
  hideSnackbar, // Manually hide snackbar
} = useSnackbar();
```

## Complete Examples

### Example 1: Delete with Confirmation

```tsx
import { PageWrapper, useSnackbar } from '@/components/UI';

const WorkersTable = () => {
  const { showSuccess, showError } = useSnackbar();

  const handleDelete = async (worker: Worker) => {
    if (confirm(`Delete ${worker.name}?`)) {
      try {
        await api.deleteWorker(worker.id);
        showSuccess(`${worker.name} has been deleted`);
        refreshTable();
      } catch (error) {
        showError('Failed to delete worker. Please try again.');
      }
    }
  };

  return (
    <Table>
      {workers.map((worker) => (
        <TableRow key={worker.id}>
          <TableCell>{worker.name}</TableCell>
          <TableCell>
            <button onClick={() => handleDelete(worker)}>Delete</button>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
};
```

### Example 2: Create/Update Operations

```tsx
import { PageWrapper, useSnackbar } from '@/components/UI';

const AddMemberForm = ({ onClose }: { onClose: () => void }) => {
  const { showSuccess, showError } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: MemberData) => {
    setLoading(true);
    try {
      await api.createMember(data);
      showSuccess('Member added successfully');
      onClose();
    } catch (error) {
      showError('Failed to add member. Please check the data and try again.');
    } finally {
      setLoading(false);
    }
  };

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
};

export const WorkersPage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <PageWrapper
      title="All Workers"
      actions={[
        {
          label: 'Add Member',
          onClick: () => setShowModal(true),
        },
      ]}
    >
      <WorkersTable />
      {showModal && <AddMemberForm onClose={() => setShowModal(false)} />}
    </PageWrapper>
  );
};
```

### Example 3: Bulk Operations

```tsx
import { PageWrapper, useSnackbar } from '@/components/UI';

const WorkersTable = () => {
  const { showSuccess, showError, showInfo } = useSnackbar();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      showInfo('Please select workers to delete');
      return;
    }

    try {
      await api.bulkDeleteWorkers(selectedIds);
      showSuccess(`${selectedIds.length} workers deleted successfully`);
      setSelectedIds([]);
      refreshTable();
    } catch (error) {
      showError('Failed to delete some workers. Please try again.');
    }
  };

  return (
    <div>
      <button onClick={handleBulkDelete} disabled={selectedIds.length === 0}>
        Delete Selected ({selectedIds.length})
      </button>
      <Table>{/* table with checkboxes */}</Table>
    </div>
  );
};
```

### Example 4: Status Updates

```tsx
import { PageWrapper, useSnackbar } from '@/components/UI';

const WorkersTable = () => {
  const { showSuccess, showWarning } = useSnackbar();

  const handleStatusToggle = async (worker: Worker) => {
    const newStatus = worker.status === 'active' ? 'inactive' : 'active';

    try {
      await api.updateWorkerStatus(worker.id, newStatus);

      if (newStatus === 'inactive') {
        showWarning(`${worker.name} has been deactivated`);
      } else {
        showSuccess(`${worker.name} has been activated`);
      }

      refreshTable();
    } catch (error) {
      showError('Failed to update worker status');
    }
  };

  return <Table>{/* table with status toggle */}</Table>;
};
```

### Example 5: Export Operations

```tsx
import { PageWrapper, useSnackbar } from '@/components/UI';

export const ReportsPage = () => {
  const { showSuccess, showError, showInfo } = useSnackbar();

  const handleExport = async (format: 'pdf' | 'excel') => {
    showInfo('Preparing export...');

    try {
      const blob = await api.exportReport(format);
      downloadFile(blob, `report.${format}`);
      showSuccess(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      showError('Failed to export report. Please try again.');
    }
  };

  return (
    <PageWrapper
      title="Reports"
      actions={[
        {
          label: 'Export PDF',
          onClick: () => handleExport('pdf'),
        },
        {
          label: 'Export Excel',
          onClick: () => handleExport('excel'),
        },
      ]}
    >
      <ReportsContent />
    </PageWrapper>
  );
};
```

### Example 6: Save/Undo Operations

```tsx
import { PageWrapper, useSnackbar } from '@/components/UI';

const SettingsForm = () => {
  const { showSuccess, showSnackbar } = useSnackbar();
  const [previousData, setPreviousData] = useState(null);

  const handleSave = async (data: Settings) => {
    setPreviousData(getCurrentData());

    try {
      await api.saveSettings(data);
      showSuccess('Settings saved successfully');
    } catch (error) {
      // Restore previous data
      restoreData(previousData);
      showError('Failed to save settings');
    }
  };

  return <form>{/* settings form */}</form>;
};
```

## Generic Method

For custom variants or more control:

```tsx
const { showSnackbar } = useSnackbar();

// With specific variant
showSnackbar('Operation completed', 'success');
showSnackbar('Something went wrong', 'error');
showSnackbar('Please review this', 'warning');
showSnackbar('Here is some info', 'info');
```

## Notification Types

| Method | Color | Use Case |
|--------|-------|----------|
| `showSuccess` | Green | Successful operations (create, update, delete) |
| `showError` | Red | Failed operations, errors |
| `showWarning` | Yellow | Warnings, cautions, destructive actions |
| `showInfo` | Blue | Informational messages, progress updates |

## Auto-Hide Duration

Notifications automatically disappear after 3 seconds (3000ms). This is the default behavior and cannot be changed per notification (it's a global setting).

## Position

Notifications appear at the **bottom-right** of the screen by default.

## Best Practices

1. **Be specific** - Use clear, descriptive messages
   ```tsx
   // Good
   showSuccess('Worker "John Doe" has been deleted');

   // Not as good
   showSuccess('Deleted');
   ```

2. **Use appropriate variants** - Match the notification type to the action
   ```tsx
   // Correct
   showSuccess('Data saved');
   showError('Failed to save');
   showWarning('This action cannot be undone');
   showInfo('Processing your request...');
   ```

3. **Include entity names** - Help users understand what changed
   ```tsx
   showSuccess(`${worker.name} added to team`);
   ```

4. **Provide context for errors** - Help users understand what went wrong
   ```tsx
   showError('Failed to delete worker. They may have active assignments.');
   ```

5. **Don't overuse** - Only show notifications for meaningful actions

## Complete Page Example

```tsx
import { PageWrapper, useSnackbar } from '@/components/UI';
import { useState } from 'react';

const WorkersContent = () => {
  const { showSuccess, showError, showWarning } = useSnackbar();
  const [workers, setWorkers] = useState<Worker[]>([]);

  const handleDelete = async (worker: Worker) => {
    if (!confirm(`Delete ${worker.name}?`)) return;

    try {
      await api.deleteWorker(worker.id);
      showSuccess(`${worker.name} has been deleted`);
      setWorkers((prev) => prev.filter((w) => w.id !== worker.id));
    } catch (error) {
      showError('Failed to delete worker');
    }
  };

  const handleStatusChange = async (worker: Worker, newStatus: string) => {
    try {
      await api.updateStatus(worker.id, newStatus);

      if (newStatus === 'inactive') {
        showWarning(`${worker.name} has been deactivated`);
      } else {
        showSuccess(`${worker.name} status updated to ${newStatus}`);
      }

      refreshWorkers();
    } catch (error) {
      showError('Failed to update status');
    }
  };

  return (
    <WorkersTable
      workers={workers}
      onDelete={handleDelete}
      onStatusChange={handleStatusChange}
    />
  );
};

export const WorkersPage = () => {
  const { showSuccess, showError } = useSnackbar();

  const handleAddMember = async (data: MemberData) => {
    try {
      await api.createMember(data);
      showSuccess('New member added successfully');
    } catch (error) {
      showError('Failed to add member');
    }
  };

  return (
    <PageWrapper
      title="All Workers"
      description="Manage worker details, roles, and assignments in one place."
      actions={[
        {
          label: 'Add Member',
          icon: <AddIcon />,
          onClick: () => openAddMemberModal(handleAddMember),
        },
      ]}
      showSearch
      showFilter
    >
      <WorkersContent />
    </PageWrapper>
  );
};
```

## Key Points

- ✅ **Automatic integration** - Snackbar is already included in PageWrapper
- ✅ **Easy to use** - Just import and call the methods
- ✅ **Works anywhere** - Any component inside PageWrapper can use it
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Consistent UX** - Same notification style across all pages

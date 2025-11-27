# Migration Guide: Global Snackbar & SetupFormWrapper

## Overview

We've created a **global SnackbarContext** and **SetupFormWrapper** to eliminate boilerplate in forms and provide consistent error/success notifications everywhere.

---

## What Changed?

### 1. Global Snackbar Context

**Before:**
- PageWrapper had its own SnackbarContext (only worked in pages)
- Modals couldn't show snackbars
- Standalone forms needed manual snackbar state

**After:**
- One global `GlobalSnackbarProvider` in [App.tsx](src/App.tsx)
- `useSnackbar()` works **everywhere** (pages, modals, components)
- Consistent API across the entire app

### 2. SetupFormWrapper

**Before:**
- Manual form setup with `useForm`, `FormProvider`
- Manual API error handling with try/catch
- Manual snackbar state management
- Manual modal button wiring
- ~80-100 lines of boilerplate per form

**After:**
- One `<SetupFormWrapper>` component
- Automatic error handling
- Automatic snackbar notifications
- Automatic modal integration
- ~20-30 lines per form

---

## Migration Steps

### Step 1: Remove PageWrapper's SnackbarContext (if needed)

PageWrapper's SnackbarContext still works, but you can now use the global one:

**Before:**
```tsx
import { PageWrapper, useSnackbar } from '@/components/UI/PageWrapper';

const MyPage = () => {
  const { showSuccess } = useSnackbar(); // From PageWrapper
  // ...
};
```

**After:**
```tsx
import { PageWrapper } from '@/components/UI/PageWrapper';
import { useSnackbar } from '@/contexts/SnackbarContext'; // Global

const MyPage = () => {
  const { showSuccess } = useSnackbar(); // Global, works anywhere
  // ...
};
```

### Step 2: Migrate Modal Forms to SetupFormWrapper

**Before (AddMemberScreen.tsx - 89 lines):**
```tsx
import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGlobalModalInnerContext } from '../../context';

const AddMemberScreen = ({ onInvite }) => {
  const methods = useForm({
    resolver: yupResolver(fieldRules),
    defaultValues,
  });

  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnConfirm } =
    useGlobalModalInnerContext();

  useEffect(() => {
    updateModalTitle('Add Member');
    updateGlobalModalInnerConfig({
      confirmModalButtonText: 'Invite',
      cancelButtonText: 'Cancel',
    });
    updateOnClose(() => reset());
    setSkipResetModal(true);
  }, []);

  const onSubmit = async (data) => {
    try {
      await onInvite(data);
      reset();
    } catch (error) {
      console.error(error); // ❌ No user feedback
    }
  };

  useEffect(() => {
    updateOnConfirm(() => handleSubmit(onSubmit)());
  }, []);

  return (
    <FormProvider {...methods}>
      <Input name="email" />
      <Dropdown name="role" />
    </FormProvider>
  );
};
```

**After (AddMemberScreen.new.tsx - 20 lines):**
```tsx
import { SetupFormWrapper } from '@/components/UI/SetupFormWrapper';

const AddMemberScreen = ({ onInvite }) => {
  return (
    <SetupFormWrapper
      title="Add Member"
      schema={AddMemberFormSchema}
      confirmButtonText="Invite"
      successMessage="Member invited successfully!"
      onSubmit={onInvite}
    >
      <Input name="email" />
      <Dropdown name="role" preFetchedOptions={roles} />
    </SetupFormWrapper>
  );
};
```

**What you get automatically:**
- ✅ Modal title set
- ✅ Buttons configured
- ✅ Form validation
- ✅ API error handling with snackbar
- ✅ Success snackbar
- ✅ Loading states
- ✅ Form reset after success
- ✅ Modal close after success

### Step 3: Migrate Standalone Forms

**Before (Login.tsx - manual snackbar):**
```tsx
const Login = () => {
  const methods = useForm({ resolver: yupResolver(schema) });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    variant: 'success',
  });

  const onSubmit = async (data) => {
    try {
      await authService.login(data);
      setSnackbar({
        open: true,
        message: 'Login successful!',
        variant: 'success',
      });
      navigate('/dashboard');
    } catch (error) {
      setSnackbar({
        open: true,
        message: extractErrorMessage(error),
        variant: 'error',
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input name="username" />
        <PasswordInput name="password" />
        <Button type="submit">Log In</Button>
      </form>
      <Snackbar {...snackbar} onClose={() => setSnackbar({ ...snackbar, open: false })} />
    </FormProvider>
  );
};
```

**After (with SetupFormWrapper):**
```tsx
import { SetupFormWrapper } from '@/components/UI/SetupFormWrapper';

const Login = () => {
  const navigate = useNavigate();

  return (
    <SetupFormWrapper
      schema={LoginSchema}
      submitButtonText="Log In"
      successMessage="Login successful!"
      onSubmit={async (data) => {
        await authService.login(data);
      }}
      onSuccess={() => {
        navigate('/dashboard');
      }}
    >
      <Input name="username" />
      <PasswordInput name="password" />
    </SetupFormWrapper>
  );
};
```

---

## API Reference

### Global Snackbar Hook

```tsx
import { useSnackbar } from '@/contexts/SnackbarContext';

const MyComponent = () => {
  const { showSuccess, showError, showWarning, showInfo } = useSnackbar();

  const handleAction = async () => {
    try {
      await api.doSomething();
      showSuccess('Action completed!');
    } catch (error) {
      showError('Action failed');
    }
  };
};
```

### SetupFormWrapper Props

See [SetupFormWrapper README](src/components/UI/SetupFormWrapper/README.md) for full documentation.

**Basic Usage:**
```tsx
<SetupFormWrapper
  schema={MySchema}
  onSubmit={async (data) => await api.submit(data)}
  successMessage="Success!"
>
  <Input name="field1" />
  <Dropdown name="field2" />
</SetupFormWrapper>
```

---

## Files Changed

### New Files
- ✅ [src/contexts/SnackbarContext.tsx](src/contexts/SnackbarContext.tsx) - Global snackbar context
- ✅ [src/components/UI/SetupFormWrapper/](src/components/UI/SetupFormWrapper/) - Form wrapper component
- ✅ [src/components/UI/SetupFormWrapper/README.md](src/components/UI/SetupFormWrapper/README.md) - Documentation

### Modified Files
- ✅ [src/App.tsx](src/App.tsx) - Added `GlobalSnackbarProvider`

### Example Files
- ✅ [src/components/UI/GlobalModal/screens/AddMember/AddMemberScreen.new.tsx](src/components/UI/GlobalModal/screens/AddMember/AddMemberScreen.new.tsx) - Refactored example

---

## Backward Compatibility

### PageWrapper's SnackbarContext

The old `PageWrapper` SnackbarContext **still works** for backward compatibility. You can migrate gradually:

**Old way (still works):**
```tsx
import { PageWrapper, useSnackbar } from '@/components/UI/PageWrapper';
// useSnackbar from PageWrapper
```

**New way (recommended):**
```tsx
import { PageWrapper } from '@/components/UI/PageWrapper';
import { useSnackbar } from '@/contexts/SnackbarContext';
// useSnackbar from global context
```

---

## Migration Checklist

### For Modal Forms:
- [ ] Replace manual `useForm` + `FormProvider` with `SetupFormWrapper`
- [ ] Remove `useEffect` hooks for modal configuration
- [ ] Remove manual try/catch API error handling
- [ ] Add `title`, `confirmButtonText`, `successMessage` props
- [ ] Test modal opening, submission, error handling, success flow

### For Standalone Forms:
- [ ] Replace manual form setup with `SetupFormWrapper`
- [ ] Remove manual snackbar state (`useState`)
- [ ] Remove `<Snackbar>` component from JSX
- [ ] Add `submitButtonText`, `successMessage` props
- [ ] Test form submission, error handling, success flow

### For Components Using Snackbar:
- [ ] Change import from `@/components/UI/PageWrapper` to `@/contexts/SnackbarContext`
- [ ] Verify snackbar works outside PageWrapper
- [ ] Test success/error/warning/info variants

---

## Benefits

### Before
- ❌ Duplicate snackbar logic in every form
- ❌ Manual API error handling
- ❌ ~80-100 lines per form
- ❌ Modals can't show snackbars
- ❌ Inconsistent error messages

### After
- ✅ One global snackbar context
- ✅ Automatic API error handling
- ✅ ~20-30 lines per form
- ✅ Snackbars work everywhere
- ✅ Consistent user feedback

---

## Need Help?

- See [SetupFormWrapper README](src/components/UI/SetupFormWrapper/README.md) for detailed documentation
- Check [AddMemberScreen.new.tsx](src/components/UI/GlobalModal/screens/AddMember/AddMemberScreen.new.tsx) for example
- Global snackbar context: [SnackbarContext.tsx](src/contexts/SnackbarContext.tsx)

---

## Recommended Migration Order

1. **Start with new forms** - Use SetupFormWrapper for all new forms
2. **Migrate modal forms** - They have the most boilerplate
3. **Migrate standalone forms** - Login, signup, etc.
4. **Update existing components** - Switch to global useSnackbar
5. **Remove PageWrapper SnackbarContext** - Once all components migrated

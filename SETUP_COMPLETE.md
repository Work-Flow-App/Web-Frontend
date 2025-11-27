# ✅ Setup Complete: Global Snackbar & SetupFormWrapper

## What Was Created

### 1. Global Snackbar Context ✅
**Location:** [src/contexts/SnackbarContext.tsx](src/contexts/SnackbarContext.tsx)

A single, global snackbar context that works **everywhere** in your app:
- ✅ Pages
- ✅ Modals
- ✅ Components
- ✅ Forms

**Usage:**
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

---

### 2. SetupFormWrapper Component ✅
**Location:** [src/components/UI/SetupFormWrapper/](src/components/UI/SetupFormWrapper/)

A universal form wrapper that automatically handles:
- ✅ API error handling
- ✅ Success/error snackbar notifications
- ✅ Loading states
- ✅ Form validation
- ✅ Modal integration (auto-wires to confirm button)
- ✅ Standalone forms (with submit button)

**Modal Usage:**
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

**Standalone Usage:**
```tsx
const LoginForm = () => {
  return (
    <SetupFormWrapper
      schema={LoginSchema}
      submitButtonText="Log In"
      successMessage="Login successful!"
      onSubmit={async (data) => {
        await authService.login(data);
      }}
      onSuccess={() => navigate('/dashboard')}
    >
      <Input name="username" />
      <PasswordInput name="password" />
    </SetupFormWrapper>
  );
};
```

---

### 3. Updated Files ✅

#### App.tsx
Added `GlobalSnackbarProvider` at the root level:
```tsx
<GlobalSnackbarProvider>
  <GlobalModalOuterContextProvider>
    <Router>
      {/* routes */}
    </Router>
  </GlobalModalOuterContextProvider>
</GlobalSnackbarProvider>
```

#### PageWrapper.tsx
Removed local SnackbarProvider and now uses the global snackbar context.

---

## File Structure

```
src/
├── contexts/
│   └── SnackbarContext.tsx          ✅ Global snackbar context
├── components/
│   └── UI/
│       ├── SetupFormWrapper/
│       │   ├── SetupFormWrapper.tsx         ✅ Main component
│       │   ├── SetupFormWrapper.types.ts    ✅ TypeScript types
│       │   ├── SetupFormWrapper.styled.tsx  ✅ Styled components
│       │   ├── index.ts                     ✅ Exports
│       │   └── README.md                    ✅ Full documentation
│       ├── PageWrapper/
│       │   └── PageWrapper.tsx              ✅ Updated to use global snackbar
│       └── GlobalModal/
│           └── screens/
│               └── AddMember/
│                   └── AddMemberScreen.new.tsx  ✅ Example refactor
├── App.tsx                          ✅ Wrapped with GlobalSnackbarProvider
├── MIGRATION_GUIDE.md               ✅ Migration instructions
└── SETUP_COMPLETE.md                ✅ This file
```

---

## Benefits

### Before
- ❌ Duplicate snackbar logic in every form
- ❌ Manual API error handling with try/catch
- ❌ Manual snackbar state management
- ❌ ~80-100 lines per modal form
- ❌ Modals can't show snackbars
- ❌ Inconsistent error messages

### After
- ✅ One global snackbar context
- ✅ Automatic API error handling
- ✅ Automatic snackbar notifications
- ✅ ~20-30 lines per modal form
- ✅ Snackbars work everywhere
- ✅ Consistent user feedback
- ✅ Type-safe with TypeScript

---

## Code Comparison

### Modal Form: Before vs After

**Before (89 lines):**
```tsx
const AddMemberScreen = ({ onInvite }) => {
  const methods = useForm({
    resolver: yupResolver(fieldRules),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = methods;

  const {
    updateModalTitle,
    updateGlobalModalInnerConfig,
    updateOnClose,
    updateOnConfirm,
    setSkipResetModal,
  } = useGlobalModalInnerContext();

  useEffect(() => {
    updateModalTitle('Add Member');
    updateGlobalModalInnerConfig({
      confirmModalButtonText: 'Invite',
      cancelButtonText: 'Cancel',
      confirmButtonOnly: false,
    });
    updateOnClose(() => {
      reset();
    });
    setSkipResetModal?.(true);
  }, []);

  const onSubmit = async (data) => {
    try {
      if (onInvite) {
        await onInvite(data);
      }
      reset();
    } catch (error) {
      console.error('Error sending invitation:', error);
      // ❌ No user feedback!
    }
  };

  useEffect(() => {
    updateOnConfirm(() => {
      handleSubmit(onSubmit)();
    });
  }, []);

  return (
    <FormProvider {...methods}>
      <S.FormWrapper>
        <S.FieldWrapper>
          <Input
            name="email"
            label={fieldLabels.email}
            placeholder={placeHolders.email}
            error={errors.email}
            disabled={isSubmitting}
            fullWidth
          />
        </S.FieldWrapper>

        <S.FieldWrapper>
          <Dropdown
            name="role"
            label={fieldLabels.role}
            placeHolder={placeHolders.role}
            preFetchedOptions={roles}
            error={errors.role}
            isDisabled={isSubmitting}
            fullWidth
          />
        </S.FieldWrapper>
      </S.FormWrapper>
    </FormProvider>
  );
};
```

**After (20 lines):**
```tsx
const AddMemberScreen = ({ onInvite }) => {
  return (
    <SetupFormWrapper
      title="Add Member"
      schema={AddMemberFormSchema}
      confirmButtonText="Invite"
      successMessage="Member invited successfully!"
      errorMessage="Failed to invite member. Please try again."
      onSubmit={onInvite}
      closeModalOnSuccess={true}
    >
      <S.FieldWrapper>
        <Input name="email" label="Email" placeholder="Enter email address" fullWidth />
      </S.FieldWrapper>

      <S.FieldWrapper>
        <Dropdown name="role" label="Role" placeHolder="Select a role" preFetchedOptions={roles} fullWidth />
      </S.FieldWrapper>
    </SetupFormWrapper>
  );
};
```

**Result:** 89 lines → 20 lines (77% reduction!)

---

## Next Steps

### 1. Start Using It
For new forms, use `SetupFormWrapper` immediately:

```tsx
import { SetupFormWrapper } from '@/components/UI/SetupFormWrapper';
```

### 2. Use Global Snackbar Everywhere
Import from the global context:

```tsx
import { useSnackbar } from '@/contexts/SnackbarContext';
```

### 3. Migrate Existing Forms (Optional)
See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for step-by-step instructions.

---

## Documentation

- **Full Documentation:** [SetupFormWrapper README](src/components/UI/SetupFormWrapper/README.md)
- **Migration Guide:** [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
- **Example Refactor:** [AddMemberScreen.new.tsx](src/components/UI/GlobalModal/screens/AddMember/AddMemberScreen.new.tsx)

---

## Quick Reference

### Global Snackbar API
```tsx
const { showSuccess, showError, showWarning, showInfo } = useSnackbar();

showSuccess('Operation successful!');
showError('Operation failed');
showWarning('Be careful!');
showInfo('Here is some info');
```

### SetupFormWrapper Props (Key Ones)

| Prop | Type | Description |
|------|------|-------------|
| `schema` | `any` | Yup validation schema |
| `onSubmit` | `(data) => Promise` | API call function |
| `successMessage` | `string` | Success snackbar message |
| `errorMessage` | `string` | Error snackbar message |
| `title` | `string` | Modal title (modal mode) |
| `confirmButtonText` | `string` | Confirm button text (modal mode) |
| `submitButtonText` | `string` | Submit button text (standalone mode) |

---

## Examples in the Wild

### Modal Form
```tsx
<SetupFormWrapper
  title="Create Worker"
  schema={WorkerSchema}
  confirmButtonText="Create"
  successMessage="Worker created!"
  onSubmit={async (data) => await api.createWorker(data)}
>
  <Input name="name" />
  <Input name="email" />
</SetupFormWrapper>
```

### Standalone Form
```tsx
<SetupFormWrapper
  schema={ProfileSchema}
  submitButtonText="Save Changes"
  successMessage="Profile updated!"
  onSubmit={async (data) => await api.updateProfile(data)}
>
  <Input name="firstName" />
  <Input name="lastName" />
</SetupFormWrapper>
```

### With Custom Success Handler
```tsx
<SetupFormWrapper
  schema={CompanySchema}
  onSubmit={api.createCompany}
  successMessage="Company created!"
  onSuccess={(data) => {
    navigate(`/company/${data.id}`);
  }}
>
  <Input name="companyName" />
</SetupFormWrapper>
```

---

## Support

If you encounter any issues:
1. Check the [README](src/components/UI/SetupFormWrapper/README.md) for detailed examples
2. Look at [AddMemberScreen.new.tsx](src/components/UI/GlobalModal/screens/AddMember/AddMemberScreen.new.tsx) for a real example
3. Review the [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)

---

## Summary

✅ Global snackbar context created
✅ SetupFormWrapper component created
✅ App.tsx updated with GlobalSnackbarProvider
✅ PageWrapper updated to use global snackbar
✅ Full documentation written
✅ Migration guide created
✅ Example refactor provided

**You're all set! Start using SetupFormWrapper for all your forms.** 🎉

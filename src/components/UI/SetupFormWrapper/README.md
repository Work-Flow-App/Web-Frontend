# SetupFormWrapper

A universal form wrapper that handles API calls, error handling, and snackbar notifications automatically. Works both in **modals** and **standalone pages**.

## Features

✅ **Automatic API error handling** - Catches errors and shows snackbar notifications
✅ **Success/error snackbars** - Automatic user feedback
✅ **Loading states** - Disables buttons during submission
✅ **Form validation** - Integrates with your existing Yup schemas
✅ **Modal integration** - Auto-wires to GlobalModal confirm button
✅ **Standalone mode** - Works as a regular form with submit button
✅ **TypeScript support** - Full type safety

---

## Usage

### In Modals (with GlobalModal)

The wrapper automatically detects when it's inside a GlobalModal and wires everything up:

```tsx
import { SetupFormWrapper } from '@/components/UI/SetupFormWrapper';
import { Input, Dropdown } from '@/components/UI/Forms';
import { MyFormSchema } from './MyFormSchema';

const MyModalScreen = ({ onSubmit }) => {
  return (
    <SetupFormWrapper
      title="Add Member"
      schema={MyFormSchema}
      confirmButtonText="Invite"
      successMessage="Member invited successfully!"
      onSubmit={async (data) => {
        await api.createMember(data);
      }}
    >
      <Input name="email" label="Email" />
      <Dropdown name="role" label="Role" preFetchedOptions={roles} />
    </SetupFormWrapper>
  );
};
```

**What it handles automatically:**
- ✅ Sets modal title
- ✅ Wires confirm button to form submit
- ✅ Shows loading state on button
- ✅ Shows success snackbar on success
- ✅ Shows error snackbar on API failure
- ✅ Closes modal after success
- ✅ Resets form

---

### Standalone Forms (outside modals)

Works as a regular form with a submit button:

```tsx
import { SetupFormWrapper } from '@/components/UI/SetupFormWrapper';
import { Input, PasswordInput } from '@/components/UI/Forms';
import { LoginSchema } from './LoginSchema';

const LoginForm = () => {
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
      <Input name="email" label="Email" />
      <PasswordInput name="password" label="Password" />
    </SetupFormWrapper>
  );
};
```

---

## Props API

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Form fields (Input, Dropdown, etc.) |
| `schema` | `any` | Yup validation schema |
| `onSubmit` | `(data) => Promise<void \| { success?: boolean, message?: string }>` | API call function |

### Common Props (Both Modal & Standalone)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValues` | `object` | `{}` | Form default values |
| `successMessage` | `string` | `undefined` | Success snackbar message |
| `errorMessage` | `string` | `"An error occurred..."` | Error snackbar message |
| `showLoadingState` | `boolean` | `true` | Show loading on submit button |
| `resetOnSuccess` | `boolean` | `true` | Reset form after success |
| `onSuccess` | `(data) => void` | `undefined` | Success callback |
| `onError` | `(error) => void` | `undefined` | Error callback |

### Modal-Specific Props

Only used when inside a GlobalModal:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `undefined` | Modal title |
| `confirmButtonText` | `string` | `"Submit"` | Confirm button text |
| `cancelButtonText` | `string` | `"Cancel"` | Cancel button text |
| `confirmButtonOnly` | `boolean` | `false` | Show only confirm button |
| `closeModalOnSuccess` | `boolean` | `true` | Close modal after success |

### Standalone-Specific Props

Only used when NOT inside a modal:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `submitButtonText` | `string` | `"Submit"` | Submit button text |
| `showSubmitButton` | `boolean` | `true` | Show submit button |
| `customSubmitButton` | `ReactNode` | `undefined` | Custom submit button |

---

## Examples

### Example 1: Simple Modal Form

```tsx
const AddMemberScreen = ({ onInvite }) => {
  return (
    <SetupFormWrapper
      title="Add Member"
      schema={AddMemberFormSchema}
      confirmButtonText="Invite"
      successMessage="Member invited!"
      onSubmit={onInvite}
    >
      <Input name="email" label="Email" />
      <Dropdown name="role" label="Role" preFetchedOptions={roles} />
    </SetupFormWrapper>
  );
};
```

**Before (89 lines)** → **After (20 lines)**

---

### Example 2: Form with Custom Success Handler

```tsx
const CreateCompanyForm = () => {
  const navigate = useNavigate();

  return (
    <SetupFormWrapper
      title="Create Company"
      schema={CompanySchema}
      confirmButtonText="Create"
      successMessage="Company created successfully!"
      onSubmit={async (data) => {
        const response = await api.createCompany(data);
        return { success: true, data: response };
      }}
      onSuccess={(data) => {
        // Navigate after successful creation
        navigate(`/company/${data.id}`);
      }}
    >
      <Input name="name" label="Company Name" />
      <Input name="email" label="Email" />
      <Input name="phone" label="Phone" />
    </SetupFormWrapper>
  );
};
```

---

### Example 3: Standalone Login Form

```tsx
const LoginPage = () => {
  const navigate = useNavigate();
  const { showSuccess } = useSnackbar();

  return (
    <PageContainer>
      <SetupFormWrapper
        schema={LoginSchema}
        submitButtonText="Log In"
        onSubmit={async (data) => {
          const response = await authService.login(data);
          localStorage.setItem('token', response.accessToken);
        }}
        onSuccess={() => {
          showSuccess('Welcome back!');
          navigate('/dashboard');
        }}
      >
        <Input name="username" label="Username" />
        <PasswordInput name="password" label="Password" />
      </SetupFormWrapper>
    </PageContainer>
  );
};
```

---

### Example 4: Form with Custom Error Handling

```tsx
const UpdateProfileForm = ({ userId }) => {
  return (
    <SetupFormWrapper
      title="Update Profile"
      schema={ProfileSchema}
      confirmButtonText="Save"
      successMessage="Profile updated!"
      errorMessage="Failed to update profile"
      onSubmit={async (data) => {
        await api.updateUser(userId, data);
      }}
      onError={(error) => {
        // Custom error logging
        console.error('Profile update failed:', error);
        analytics.track('profile_update_failed', { userId });
      }}
    >
      <Input name="name" label="Name" />
      <Input name="email" label="Email" />
    </SetupFormWrapper>
  );
};
```

---

### Example 5: Form without Auto-Close

```tsx
const MultiStepForm = () => {
  return (
    <SetupFormWrapper
      title="Step 1: Basic Info"
      schema={Step1Schema}
      confirmButtonText="Next"
      closeModalOnSuccess={false}  // Don't close modal
      onSubmit={async (data) => {
        await api.saveStep1(data);
      }}
      onSuccess={() => {
        // Move to next step instead of closing
        updateActiveScreen(1);
      }}
    >
      <Input name="firstName" label="First Name" />
      <Input name="lastName" label="Last Name" />
    </SetupFormWrapper>
  );
};
```

---

### Example 6: Form with Custom Submit Button

```tsx
const CustomForm = () => {
  return (
    <SetupFormWrapper
      schema={MySchema}
      showSubmitButton={false}  // Hide default button
      onSubmit={api.submit}
    >
      <Input name="field1" />
      <Input name="field2" />

      {/* Custom submit button */}
      <Box display="flex" gap={2}>
        <Button type="button" onClick={() => history.back()}>
          Cancel
        </Button>
        <Button type="submit" variant="contained">
          Save & Continue
        </Button>
      </Box>
    </SetupFormWrapper>
  );
};
```

---

## How It Works

### Modal Mode

When inside a GlobalModal:
1. Detects GlobalModalInnerContext
2. Sets modal title, button text
3. Wires `onConfirm` to `handleSubmit`
4. On success: shows snackbar → closes modal
5. On error: shows error snackbar

### Standalone Mode

When NOT in a modal:
1. Renders form with submit button
2. On submit: calls API
3. On success: shows snackbar → calls `onSuccess`
4. On error: shows error snackbar

---

## Migration Guide

### Before (Manual Handling)

```tsx
const AddMemberScreen = ({ onInvite }) => {
  const methods = useForm({ resolver: yupResolver(schema) });
  const { updateModalTitle, updateOnConfirm } = useGlobalModalInnerContext();

  useEffect(() => {
    updateModalTitle('Add Member');
    updateGlobalModalInnerConfig({ confirmButtonText: 'Invite' });
    updateOnConfirm(() => handleSubmit(onSubmit)());
  }, []);

  const onSubmit = async (data) => {
    try {
      await onInvite(data);
      reset();
    } catch (error) {
      console.error(error);  // ❌ No user feedback
    }
  };

  return (
    <FormProvider {...methods}>
      <Input name="email" />
      <Dropdown name="role" />
    </FormProvider>
  );
};
```

### After (With SetupFormWrapper)

```tsx
const AddMemberScreen = ({ onInvite }) => {
  return (
    <SetupFormWrapper
      title="Add Member"
      schema={AddMemberFormSchema}
      confirmButtonText="Invite"
      successMessage="Member invited!"
      onSubmit={onInvite}
    >
      <Input name="email" />
      <Dropdown name="role" />
    </SetupFormWrapper>
  );
};
```

**Lines of code:** 89 → 20
**Boilerplate:** Eliminated
**Error handling:** Automatic
**Snackbar notifications:** Automatic

---

## TypeScript

```tsx
import { SetupFormWrapper } from '@/components/UI/SetupFormWrapper';

interface MyFormData {
  email: string;
  role: string;
}

const MyForm = () => {
  return (
    <SetupFormWrapper<MyFormData>
      schema={MySchema}
      onSubmit={async (data) => {
        // data is typed as MyFormData
        await api.submit(data);
      }}
      onSuccess={(data) => {
        // data is typed as MyFormData
        console.log(data.email);
      }}
    >
      <Input name="email" />
      <Dropdown name="role" />
    </SetupFormWrapper>
  );
};
```

---

## Advanced: External Form Methods

If you need to control the form from outside (e.g., programmatic validation):

```tsx
const MyForm = () => {
  const methods = useForm<MyFormData>({
    resolver: yupResolver(MySchema),
  });

  const handleCustomAction = () => {
    // Access form methods
    const values = methods.getValues();
    methods.setValue('email', 'new@example.com');
  };

  return (
    <SetupFormWrapper
      formMethods={methods}  // Pass external methods
      onSubmit={api.submit}
    >
      <Input name="email" />
      <Button onClick={handleCustomAction}>Custom Action</Button>
    </SetupFormWrapper>
  );
};
```

---

## FAQs

### Q: Do I still need to use FormProvider?
**A:** No! SetupFormWrapper provides FormProvider internally.

### Q: Can I use it with PageWrapper?
**A:** Yes! It uses the global SnackbarContext, so it works everywhere.

### Q: How does it detect modal vs standalone?
**A:** It checks for GlobalModalInnerContext. If present → modal mode. Otherwise → standalone.

### Q: Can I disable auto-close after success?
**A:** Yes, set `closeModalOnSuccess={false}`.

### Q: Can I customize error messages per field?
**A:** Field errors come from your Yup schema. SetupFormWrapper only handles API-level errors.

### Q: What if I don't want a success message?
**A:** Don't provide `successMessage` prop. No snackbar will be shown.

---

## Related

- [GlobalSnackbarContext](../../../contexts/SnackbarContext.tsx) - Global snackbar notifications
- [GlobalModal](../GlobalModal/README.md) - Modal system
- [PageWrapper](../PageWrapper/README.md) - Page layout with snackbar (deprecated for forms)

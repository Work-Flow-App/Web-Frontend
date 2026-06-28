# GlobalModal Component

A reusable, context-based modal system for the Floow application. The GlobalModal provides a flexible way to display modal dialogs with consistent styling and behavior.

## Features

- 🎯 Context-based state management (Inner & Outer contexts)
- 📱 Three size variants (Small, Medium, Large)
- 🔄 Multi-screen support with back navigation
- ✨ Customizable header, footer, and action buttons
- 📝 Form integration with react-hook-form
- 🎨 Consistent styling with the design system

## Installation & Setup

### 1. Wrap your app with GlobalModalOuterContextProvider

```tsx
import { GlobalModalOuterContextProvider, GlobalModal } from './components/UI/GlobalModal';

function App() {
  return (
    <GlobalModalOuterContextProvider>
      {/* Your app content */}
      <GlobalModal />
    </GlobalModalOuterContextProvider>
  );
}
```

### 2. Use the modal context in your components

```tsx
import { useGlobalModalOuterContext } from './components/UI/GlobalModal';
import { AddMemberScreen } from './components/UI/GlobalModal/screens';
import { ModalSizes } from './components/UI/GlobalModal';

function MyComponent() {
  const { setGlobalModalOuterProps } = useGlobalModalOuterContext();

  const handleOpenModal = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      children: <AddMemberScreen />,
      fieldName: 'addMember',
      size: ModalSizes.SMALL,
    });
  };

  return <button onClick={handleOpenModal}>Add Member</button>;
}
```

## Creating Custom Modal Screens

### Basic Example

```tsx
import { useEffect } from 'react';
import { useGlobalModalInnerContext } from '../../context';

export const MyCustomScreen = () => {
  const {
    updateModalTitle,
    updateGlobalModalInnerConfig,
    updateOnClose,
    updateOnConfirm
  } = useGlobalModalInnerContext();

  useEffect(() => {
    // Set modal title
    updateModalTitle('My Custom Modal');

    // Configure footer buttons
    updateGlobalModalInnerConfig({
      confirmModalButtonText: 'Save',
      cancelButtonText: 'Cancel',
      confirmButtonOnly: false, // Show both buttons
    });

    // Handle close
    updateOnClose(() => {
      console.log('Modal closed');
    });

    // Handle confirm
    updateOnConfirm(() => {
      console.log('Confirmed');
    });
  }, []);

  return <div>Your modal content here</div>;
};
```

### With Form Integration

```tsx
import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGlobalModalInnerContext } from '../../context';
import { useSchema } from '../../../../../utils/validation';
import { MyFormSchema } from './MyFormSchema';

export const MyFormScreen = ({ onSubmit }) => {
  const { fieldRules, defaultValues } = useSchema(MyFormSchema);

  const methods = useForm({
    resolver: yupResolver(fieldRules),
    defaultValues,
  });

  const { handleSubmit, reset } = methods;

  const {
    updateModalTitle,
    updateGlobalModalInnerConfig,
    updateOnClose,
    updateOnConfirm
  } = useGlobalModalInnerContext();

  useEffect(() => {
    updateModalTitle('Form Example');

    updateGlobalModalInnerConfig({
      confirmModalButtonText: 'Submit',
      cancelButtonText: 'Cancel',
    });

    updateOnClose(() => reset());

    updateOnConfirm(() => {
      handleSubmit(onSubmit)();
    });
  }, []);

  return (
    <FormProvider {...methods}>
      {/* Your form fields */}
    </FormProvider>
  );
};
```

## Modal Sizes

```tsx
import { ModalSizes } from './components/UI/GlobalModal';

// Small: 600px
size: ModalSizes.SMALL

// Medium: 900px
size: ModalSizes.MEDIUM

// Large: 1200px
size: ModalSizes.LARGE
```

## Context API

### GlobalModalOuterContext

Controls the modal's open/close state and top-level configuration.

```tsx
interface IGlobalModalOuterProps {
  isOpen: boolean;
  children: ReactNode;
  fieldName: string;
  parentFormMethods?: UseFormReturn<any, any, undefined>;
  parentSchema?: any;
  size?: ModalSizes;
  isEditMode?: boolean;
  modalData?: any;
  callBacks?: { [key: string]: (...args: any[]) => void };
}
```

### GlobalModalInnerContext

Controls the modal's internal behavior, title, buttons, and multi-screen navigation.

```tsx
interface IGlobalModalInnerContentState {
  activeScreen: number;
  updateActiveScreen: (state: number) => void;
  modalTitle: string;
  updateModalTitle: (title: string) => void;
  globalModalInnerConfig: IGlobalModalInnerContextConfigProps;
  updateGlobalModalInnerConfig: (config: IGlobalModalInnerContextConfigProps) => void;
  headerActionButton?: ReactNode;
  updateHeaderActionButton: (element: ReactNode) => void;
  onClose?: () => void;
  updateOnClose: (callback: () => void) => void;
  onConfirm?: () => void;
  updateOnConfirm: (callback: () => void) => void;
  resetActiveScreen: () => void;
  innerModalData?: any;
  setInnerModalData: (item?: any) => void;
  skipResetModal?: boolean;
  setSkipResetModal?: (value: boolean) => void;
}
```

## Footer Button Configurations

```tsx
// Show both buttons (default)
updateGlobalModalInnerConfig({
  confirmModalButtonText: 'Save',
  cancelButtonText: 'Cancel',
});

// Show only confirm button
updateGlobalModalInnerConfig({
  confirmModalButtonText: 'OK',
  confirmButtonOnly: true,
});

// Show only cancel button
updateGlobalModalInnerConfig({
  cancelButtonText: 'Close',
  cancelButtonOnly: true,
});

// Hide footer completely
updateGlobalModalInnerConfig({
  hideFooter: true,
});
```

## Multi-Screen Navigation

```tsx
const { activeScreen, updateActiveScreen } = useGlobalModalInnerContext();

// Navigate to screen 1
updateActiveScreen(1);

// Navigate to screen 2
updateActiveScreen(2);

// Back button automatically appears when activeScreen > 0
```

## Example: Add Member Modal

The AddMember screen is included as a reference implementation:

```tsx
import { useGlobalModalOuterContext } from './components/UI/GlobalModal';
import { AddMemberScreen } from './components/UI/GlobalModal/screens';
import { ModalSizes } from './components/UI/GlobalModal';

function MyComponent() {
  const { setGlobalModalOuterProps } = useGlobalModalOuterContext();

  const handleAddMember = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      children: (
        <AddMemberScreen
          roles={[
            { label: 'Admin', value: 'admin' },
            { label: 'Manager', value: 'manager' },
            { label: 'Worker', value: 'worker' },
          ]}
          onInvite={async (data) => {
            console.log('Invite:', data);
            // Call your API here
            await inviteUserAPI(data);
          }}
        />
      ),
      fieldName: 'addMember',
      size: ModalSizes.SMALL,
    });
  };

  return <button onClick={handleAddMember}>Add Member</button>;
}
```

## Styling

The modal uses the application's theme and design system:

- Font: Manrope
- Border radius: 16px
- Shadow: 0px 5px 55px rgba(0, 0, 0, 0.05)
- Max height: 60vh
- Modal body max height: 50vh (scrollable)

## Best Practices

1. Always wrap your app with `GlobalModalOuterContextProvider`
2. Render `<GlobalModal />` once at the app root level
3. Create separate screen components for different modal content
4. Use the validation schema system for form-based modals
5. Clean up form state in `updateOnClose` callback
6. Use `setSkipResetModal(true)` if you need manual control over modal closing

## TypeScript Support

All components are fully typed with TypeScript interfaces for better developer experience.

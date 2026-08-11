import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import AddressReviewDialog from './AddressReviewDialog';
import type { PlaceDetails } from './GoogleMap.types';

const SAMPLE_PLACE: PlaceDetails = {
  address: 'Rostocker Str. 22, Cottbus, Brandenburg, 03046, Germany',
  streetLine: 'Rostocker Str. 22',
  city: 'Cottbus',
  state: 'Brandenburg',
  postalCode: '03046',
  country: 'Germany',
  location: { lat: 51.7563, lng: 14.3329 },
};

const meta = {
  title: 'UI/GoogleMap/AddressReviewDialog',
  component: AddressReviewDialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof AddressReviewDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { open: true, initialValue: SAMPLE_PLACE, onConfirm: () => {}, onCancel: () => {} },
};

export const EmptyFields: Story = {
  args: {
    open: true,
    initialValue: { address: '123 Main St', streetLine: '123 Main St', location: { lat: 0, lng: 0 } },
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <AddressReviewDialog
        open={open}
        initialValue={SAMPLE_PLACE}
        onConfirm={(place) => {
          // eslint-disable-next-line no-console
          console.log('confirmed', place);
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    );
  },
};

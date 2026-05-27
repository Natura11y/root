import type { Meta, StoryObj } from '@storybook/react-vite';
import Alert from './index';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    success: { control: 'boolean' },
    inverse: { control: 'boolean' },
    iconHandle: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    title: 'Success',
    children: <p>Your changes have been saved successfully.</p>,
  },
};

export const Warning: Story = {
  args: {
    success: false,
    title: 'Warning',
    children: <p>Please review the form before submitting.</p>,
  },
};

export const WithIcon: Story = {
  args: {
    title: 'Notice',
    iconHandle: 'info',
    children: <p>This page has been updated with new content.</p>,
  },
};

export const Dismissable: Story = {
  args: {
    title: 'Dismissable Alert',
    children: <p>Click the close button to dismiss this alert.</p>,
    onClose: () => {},
  },
};

export const Inverse: Story = {
  args: {
    title: 'Inverse Alert',
    inverse: true,
    children: <p>This is an inverse style alert.</p>,
  },
};

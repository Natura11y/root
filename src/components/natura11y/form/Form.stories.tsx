import type { Meta, StoryObj } from '@storybook/react-vite';
import FormEntry from './FormEntry';

const meta: Meta<typeof FormEntry> = {
  title: 'Components/Form/FormEntry',
  component: FormEntry,
  tags: ['autodocs'],
  argTypes: {
    entryType: {
      control: 'select',
      options: [
        'text', 'email', 'password', 'search', 'tel', 'url',
        'textarea', 'select',
        'groupRadio', 'groupCheck', 'singleCheck', 'singleCheckSwitch',
        'fileUpload',
      ],
    },
    labelFloat: { control: 'boolean' },
    required: { control: 'boolean' },
    showError: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof FormEntry>;

export const Text: Story = {
  args: {
    labelText: 'Full name',
    entryType: 'text',
  },
};

export const Email: Story = {
  args: {
    labelText: 'Email address',
    entryType: 'email',
    required: true,
  },
};

export const FloatingLabel: Story = {
  args: {
    labelText: 'Your message',
    entryType: 'textarea',
    labelFloat: true,
  },
};

export const WithHelpText: Story = {
  args: {
    labelText: 'Password',
    entryType: 'password',
    helpText: 'Must be at least 8 characters.',
    required: true,
  },
};

export const WithError: Story = {
  args: {
    labelText: 'Email address',
    entryType: 'email',
    required: true,
    showError: true,
    helpText: 'Please enter a valid email address.',
  },
};

export const Checkbox: Story = {
  args: {
    labelText: 'I agree to the terms',
    entryType: 'singleCheck',
  },
};

export const Toggle: Story = {
  args: {
    labelText: 'Enable notifications',
    entryType: 'singleCheckSwitch',
  },
};

export const Select: Story = {
  args: {
    labelText: 'Country',
    entryType: 'select',
  },
};

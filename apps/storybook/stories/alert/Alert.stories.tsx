import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaAlert from '@core-js/alert';
import Alert from '@lib/components/natura11y/alert';
import VanillaExample from '../../utils/VanillaExample';
import alertMarkup from './alert.example.html?raw';

const initializeAlert = () => {
  new VanillaAlert().init();
};

const meta: Meta<typeof Alert> = {
  title: 'Alert',
  component: Alert,
  argTypes: {
    success: { control: 'boolean' },
    inverse: { control: 'boolean' },
    iconHandle: { control: 'text' },
  },
  parameters: {
    docs: {
      codePanel: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const HTML: Story = {
  parameters: {
    docs: {
      source: {
        code: alertMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => (
    <VanillaExample
      html={alertMarkup}
      initialize={initializeAlert}
      initializeOnceKey='alert'
    />
  ),
};

export const React: Story = {
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

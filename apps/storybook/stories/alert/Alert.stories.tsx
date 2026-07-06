import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaAlert from '@core-js/alert';
import Alert from '@lib/components/alert';
import VanillaExample from '../../utils/VanillaExample';
import alertMarkup from './alert.example.html?raw';

const initializeAlert = () => {
  new VanillaAlert().init();
};

const alertReactCode = `<Alert title="Success">
  <p>Your changes have been saved successfully.</p>
</Alert>`;

const alertWarningCode = `<Alert success={false} title="Warning">
  <p>Please review the form before submitting.</p>
</Alert>`;

const alertDismissableCode = `const [isShown, setIsShown] = useState(true);

{isShown && (
  <Alert title="Dismissable Alert" onClose={() => setIsShown(false)}>
    <p>Click the close button to dismiss this alert.</p>
  </Alert>
)}`;

const alertInverseCode = `<Alert title="Inverse Alert" inverse>
  <p>This is an inverse style alert.</p>
</Alert>`;

const DismissableAlertExample = () => {
  const [isShown, setIsShown] = useState(true);

  return isShown ? (
    <Alert title='Dismissable Alert' onClose={() => setIsShown(false)}>
      <p>Click the close button to dismiss this alert.</p>
    </Alert>
  ) : null;
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

export const DefaultHtml: Story = {
  name: 'Default (HTML)',
  parameters: {
    docs: {
      description: {
        story: 'The vanilla HTML pattern uses Natura11y core markup and JavaScript behavior.',
      },
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
  parameters: {
    docs: {
      description: {
        story: 'The React component renders the same alert pattern with a React-friendly API.',
      },
      source: {
        code: alertReactCode,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};

export const Warning: Story = {
  args: {
    success: false,
    title: 'Warning',
    children: <p>Please review the form before submitting.</p>,
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the warning style for messages that need attention before someone continues.',
      },
      source: {
        code: alertWarningCode,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};

export const Dismissable: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use `onClose` when an alert can be dismissed and the parent should remove it from the page.',
      },
      source: {
        code: alertDismissableCode,
        language: 'tsx',
        type: 'code',
      },
    },
  },
  render: () => <DismissableAlertExample />,
};

export const Inverse: Story = {
  args: {
    title: 'Inverse Alert',
    inverse: true,
    children: <p>This is an inverse style alert.</p>,
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the inverse style when the alert needs stronger visual emphasis.',
      },
      source: {
        code: alertInverseCode,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};

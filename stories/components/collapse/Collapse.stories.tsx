import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaCollapse from '@core-js/collapse';
import Collapse from '@lib/components/natura11y/collapse';
import Button from '@lib/components/natura11y/button';
import VanillaExample from '../../utils/VanillaExample';
import collapseMarkup from './collapse.example.html?raw';

const initializeCollapse = () => {
  new VanillaCollapse().init();
};

const meta: Meta<typeof Collapse> = {
  title: 'Collapse',
  component: Collapse,
  parameters: {
    docs: {
      codePanel: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Collapse>;

export const HTML: Story = {
  parameters: {
    docs: {
      source: {
        code: collapseMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => (
    <VanillaExample
      html={collapseMarkup}
      initialize={initializeCollapse}
      initializeOnceKey='collapse'
    />
  ),
};

export const React: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <Button title={isOpen ? 'Hide' : 'Show'} onClick={() => setIsOpen(!isOpen)} />
        <Collapse isOpen={isOpen}>
          <div className='padding-3 border'>
            <p>This content collapses and expands. Never put padding directly on the Collapse element — always on a child inside.</p>
          </div>
        </Collapse>
      </div>
    );
  },
};

export const FocusFirst: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <Button title={isOpen ? 'Hide' : 'Show'} onClick={() => setIsOpen(!isOpen)} />
        <Collapse isOpen={isOpen} focusFirst>
          <div className='padding-3 border'>
            <p>When opened, focus moves to the first focusable element inside.</p>
            <a href='#'>Focusable link</a>
          </div>
        </Collapse>
      </div>
    );
  },
};

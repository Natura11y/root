import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Modal from '@lib/components/natura11y/modal';
import Button from '@lib/components/natura11y/button';

const meta: Meta<typeof Modal> = {
  title: 'Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    scrollAll: { control: 'boolean' },
    closeOutside: { control: 'boolean' },
  },
  parameters: {
    docs: {
      story: { height: '500px', inline: false, width: '100%' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const React: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button title='Open Modal' onClick={() => setIsOpen(true)} />
        <Modal isOpen={isOpen} title='Modal Title' onClose={() => setIsOpen(false)}>
          <p>Modal body content goes here. The focus is trapped inside while open.</p>
        </Modal>
      </>
    );
  },
};

export const WithFooter: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button title='Open Modal' onClick={() => setIsOpen(true)} />
        <Modal
          isOpen={isOpen}
          title='Confirm Action'
          onClose={() => setIsOpen(false)}
          footerContent={
            <div className='flex-row gap-2'>
              <Button title='Confirm' onClick={() => setIsOpen(false)} />
              <Button title='Cancel' outline onClick={() => setIsOpen(false)} />
            </div>
          }
        >
          <p>Are you sure you want to proceed with this action?</p>
        </Modal>
      </>
    );
  },
};

export const CloseOutside: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button title='Open Modal' onClick={() => setIsOpen(true)} />
        <Modal
          isOpen={isOpen}
          title='Click Outside to Close'
          onClose={() => setIsOpen(false)}
          closeOutside
        >
          <p>Click anywhere outside the modal to close it.</p>
        </Modal>
      </>
    );
  },
};

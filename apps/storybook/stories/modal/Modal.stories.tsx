import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaModal from '@core-js/modal';
import Modal from '@lib/components/modal';
import Button from '@lib/components/button';
import VanillaExample from '../../utils/VanillaExample';
import modalMarkup from './modal.example.html?raw';

const initializeModal = () => {
  new VanillaModal().init();
};

const meta: Meta<typeof Modal> = {
  title: 'Modal',
  component: Modal,
  argTypes: {
    scrollAll: { control: 'boolean' },
    closeOutside: { control: 'boolean' },
  },
  parameters: {
    docs: {
      codePanel: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const DefaultHtml: Story = {
  name: 'Default (HTML)',
  parameters: {
    docs: {
      source: {
        code: modalMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => (
    <VanillaExample
      html={modalMarkup}
      initialize={initializeModal}
      initializeOnceKey='modal'
    />
  ),
};

export const DefaultReact: Story = {
  name: 'Default (React)',
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button title='Open Modal' onClick={() => setIsOpen(true)} />
        <Modal
          isOpen={isOpen}
          title='Modal Title'
          onClose={() => setIsOpen(false)}
          modalContentUtilities='narrow'
        >
          <p>Modal body content goes here.</p>
        </Modal>
      </>
    );
  },
};

export const WithFooter: Story = {
  name: 'With Footer (React)',
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button title='Open Modal' onClick={() => setIsOpen(true)} />
        <Modal
          isOpen={isOpen}
          title='Confirm Action'
          onClose={() => setIsOpen(false)}
          modalContentUtilities='narrow'
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

export const ScrollAll: Story = {
  name: 'Scroll All (React)',
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button title='Open Modal' onClick={() => setIsOpen(true)} />
        <Modal
          isOpen={isOpen}
          title='Scrollable Modal'
          onClose={() => setIsOpen(false)}
          scrollAll
          modalContentUtilities='narrow'
        >
          <p>
            Long modal content can use the scroll-all modifier when the entire modal should scroll in the viewport.
          </p>
          <p>
            This is useful when the header, body, and footer should move together instead of keeping the scroll area inside the modal body.
          </p>
          <p>
            Add enough content to test the viewport behavior at smaller screen sizes.
          </p>
        </Modal>
      </>
    );
  },
};

export const CloseOutside: Story = {
  name: 'Close Outside (React)',
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
          modalContentUtilities='narrow'
        >
          <p>Click anywhere outside the modal to close it.</p>
        </Modal>
      </>
    );
  },
};

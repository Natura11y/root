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

const meerkatBody = (
  <p>
    The <strong>meerkat</strong> (Suricata suricatta) or suricate is a small <a href='#1'>mongoose</a> found in southern Africa. It is characterised by a broad head, large eyes, a pointed snout, long legs, a thin tapering tail, and a brindled coat pattern. The head-and-body length is around 24-35 cm (9.4-13.8 in), and the weight is typically between 0.62 and 0.97 kg (1.4 and 2.1 lb). The coat is light grey to yellowish brown with alternate, poorly defined light and dark bands on the back. Meerkats have foreclaws adapted for digging and have the ability to thermoregulate to survive in their harsh, dry habitat. Three subspecies are recognised.
  </p>
);

const longMeerkatBody = (
  <>
    {meerkatBody}
    <p>
      Meerkats are eusocial and form packs of two to 30 individuals each that occupy home ranges around 5 km2 (1.9 sq mi) in area. There is a social hierarchy - generally dominant individuals in a pack breed and produce offspring, and the nonbreeding, subordinate members provide altruistic care to the pups. Breeding occurs round the year, with peaks during heavy rainfall; after a gestation of 60 to 70 days a litter of three to seven pups is born.
    </p>
    <p>
      They live in rock crevices in stony, often calcareous areas, and in large burrow systems in plains. The burrow systems, typically 5 m (16 ft) in diameter with around 15 openings, are large underground networks consisting of two to three levels of tunnels. These tunnels are around 7.5 cm (3.0 in) high at the top and wider below, and extend up to 1.5 m (4.9 ft) into the ground.
    </p>
    <p>
      Meerkats are active during the day, mostly in the early morning and late afternoon; they remain continually alert and retreat to burrows on sensing danger. They use a broad variety of calls to communicate with one another for different purposes, for example to raise alarm on sighting a predator.
    </p>
  </>
);

const modalFooter = (
  <ul className='nav nav--horizontal justify-content-between'>
    <li>
      <a href='#1'>Secondary Action</a>
    </li>
    <li>
      <a className='button border-radius-pill' href='#1'>Primary Action</a>
    </li>
  </ul>
);

const ModalExample = ({
  buttonTitle = 'Open Modal',
  scrollAll = false,
  closeOutside = false,
  children = meerkatBody,
}: {
  buttonTitle?: string;
  scrollAll?: boolean;
  closeOutside?: boolean;
  children?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button title={buttonTitle} onClick={() => setIsOpen(true)} />
      <Modal
        isOpen={isOpen}
        title='Modal Title One'
        onClose={() => setIsOpen(false)}
        scrollAll={scrollAll}
        closeOutside={closeOutside}
        modalContentUtilities='narrow'
        footerUtilities='text-color-link'
        footerContent={modalFooter}
      >
        {children}
      </Modal>
    </>
  );
};

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
  render: () => <ModalExample />,
};

export const ScrollAll: Story = {
  name: 'Scroll All (React)',
  render: () => (
    <ModalExample buttonTitle='Modal (scroll all)' scrollAll>
      {longMeerkatBody}
    </ModalExample>
  ),
};

export const CloseOutside: Story = {
  name: 'Close Outside (React)',
  render: () => (
    <ModalExample buttonTitle='Modal (close outside)' closeOutside />
  ),
};

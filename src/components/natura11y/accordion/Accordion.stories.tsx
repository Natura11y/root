import type { Meta, StoryObj } from '@storybook/react-vite';
import Accordion from './index';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    headingLevel: {
      control: 'select',
      options: [null, 2, 3, 4, 5, 6],
    },
    defaultOpen: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: (args) => (
    <Accordion {...args}>
      <Accordion.Item itemId='item-1' title='What is Natura11y?'>
        <p>Natura11y is an open-source accessibility-first design system built for modern web development.</p>
      </Accordion.Item>
      <Accordion.Item itemId='item-2' title='How do I get started?'>
        <p>Install the package via npm and import the components you need into your project.</p>
      </Accordion.Item>
      <Accordion.Item itemId='item-3' title='Is it accessible?'>
        <p>Yes. All components follow WCAG guidelines and include proper ARIA attributes and keyboard navigation.</p>
      </Accordion.Item>
    </Accordion>
  ),
};

export const WithDefaultOpen: Story = {
  render: (args) => (
    <Accordion {...args} defaultOpen='item-1'>
      <Accordion.Item itemId='item-1' title='This item is open by default'>
        <p>This panel is open when the component first renders.</p>
      </Accordion.Item>
      <Accordion.Item itemId='item-2' title='Second item'>
        <p>Click to expand this panel.</p>
      </Accordion.Item>
      <Accordion.Item itemId='item-3' title='Third item'>
        <p>Click to expand this panel.</p>
      </Accordion.Item>
    </Accordion>
  ),
};

export const WithHeadings: Story = {
  render: (args) => (
    <Accordion {...args} headingLevel={3}>
      <Accordion.Item itemId='item-1' title='Wrapped in an h3'>
        <p>Each accordion button is wrapped in an h3 element for proper document outline.</p>
      </Accordion.Item>
      <Accordion.Item itemId='item-2' title='Second heading'>
        <p>Use headingLevel when the accordion lives inside a section with a known heading hierarchy.</p>
      </Accordion.Item>
      <Accordion.Item itemId='item-3' title='Third heading'>
        <p>Omit headingLevel when the accordion is standalone or headings are not needed.</p>
      </Accordion.Item>
    </Accordion>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import Tabs from '@lib/components/natura11y/tab';
import Tab from '@lib/components/natura11y/tab/Tab';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tab',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    pill: { control: 'boolean' },
    breakpoint: {
      control: 'radio',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: (args) => (
    <Tabs {...args}>
      <Tab title='Overview'>
        <p>Overview content. Tabs use arrow key navigation between tab buttons.</p>
      </Tab>
      <Tab title='Installation'>
        <p>Installation instructions go here.</p>
      </Tab>
      <Tab title='Usage'>
        <p>Usage examples and code snippets.</p>
      </Tab>
    </Tabs>
  ),
};

export const Pill: Story = {
  render: (args) => (
    <Tabs {...args} pill>
      <Tab title='All'>
        <p>Showing all items.</p>
      </Tab>
      <Tab title='Active'>
        <p>Showing active items only.</p>
      </Tab>
      <Tab title='Archived'>
        <p>Showing archived items.</p>
      </Tab>
    </Tabs>
  ),
};

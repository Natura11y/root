import type { Meta, StoryObj } from '@storybook/react-vite';
import Dropdown from '@lib/components/natura11y/dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'radio', options: ['dropdown', 'mega'] },
    hover: { control: 'boolean' },
    linkSplit: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  args: {
    buttonText: 'Options',
  },
  render: (args) => (
    <Dropdown {...args}>
      <ul>
        <li><a href='#'>Profile</a></li>
        <li><a href='#'>Settings</a></li>
        <li><a href='#'>Sign out</a></li>
      </ul>
    </Dropdown>
  ),
};

export const WithSplitLink: Story = {
  args: {
    buttonText: 'Components',
    linkSplit: true,
    linkHref: '#',
    linkText: 'Components',
  },
  render: (args) => (
    <Dropdown {...args}>
      <ul>
        <li><a href='#'>Accordion</a></li>
        <li><a href='#'>Button</a></li>
        <li><a href='#'>Card</a></li>
        <li><a href='#'>Modal</a></li>
      </ul>
    </Dropdown>
  ),
};

export const HoverOpen: Story = {
  args: {
    buttonText: 'Hover me',
    hover: true,
  },
  render: (args) => (
    <Dropdown {...args}>
      <ul>
        <li><a href='#'>Item one</a></li>
        <li><a href='#'>Item two</a></li>
        <li><a href='#'>Item three</a></li>
      </ul>
    </Dropdown>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaDropdown from '@core-js/dropdown';
import Dropdown from '@lib/components/dropdown';
import VanillaExample from '../../utils/VanillaExample';
import dropdownMarkup from './dropdown.example.html?raw';

const initializeDropdown = () => {
  new VanillaDropdown().init();
};

const meta: Meta<typeof Dropdown> = {
  title: 'Dropdown',
  component: Dropdown,
  argTypes: {
    type: { control: 'radio', options: ['dropdown', 'mega'] },
    hover: { control: 'boolean' },
    linkSplit: { control: 'boolean' },
  },
  parameters: {
    docs: {
      codePanel: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const HTML: Story = {
  parameters: {
    docs: {
      source: {
        code: dropdownMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => (
    <VanillaExample
      html={dropdownMarkup}
      initialize={initializeDropdown}
      initializeOnceKey='dropdown'
    />
  ),
};

export const React: Story = {
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

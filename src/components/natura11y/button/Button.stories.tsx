import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from './index';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    title: 'Button',
    tag: 'button',
    buttonType: 'button',
    wrapText: true,
    linkUrl: '#',
    outline: false,
    iconStartHandle: null,
    iconEndHandle: null,
    utilities: '',
  },
  argTypes: {
    tag: {
      control: 'radio',
      options: ['button', 'a'],
    },
    buttonType: {
      control: 'radio',
      options: ['button', 'submit', 'reset'],
    },
    title: { control: 'text' },
    wrapText: { control: 'boolean' },
    outline: { control: 'boolean' },
    iconStartHandle: { control: 'text' },
    iconEndHandle: { control: 'text' },
    linkUrl: { control: 'text' },
    target: { control: 'text' },
    rel: { control: 'text' },
    utilities: { control: 'text' },
    attributes: { control: false },
    onClick: { control: false },
    iconHandle: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
  args: {
    outline: true,
  },
};

export const WithIcon: Story = {
  args: {
    title: 'Edit',
    iconStartHandle: 'edit',
  },
};

export const Disperse: Story = {
  args: {
    iconEndHandle: 'arrow-right',
    utilities: 'button--disperse',
  },
};

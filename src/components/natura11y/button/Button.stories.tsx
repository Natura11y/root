import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from './index';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    tag: {
      control: 'radio',
      options: ['button', 'a'],
    },
    buttonType: {
      control: 'radio',
      options: ['button', 'submit', 'reset'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    title: 'Button',
  },
};

export const Outline: Story = {
  args: {
    title: 'Outline Button',
    outline: true,
  },
};

export const WithIconStart: Story = {
  args: {
    title: 'Menu',
    iconStartHandle: 'menu',
  },
};

export const WithIconEnd: Story = {
  args: {
    title: 'Next',
    iconEndHandle: 'arrow-right',
  },
};

export const AsLink: Story = {
  args: {
    tag: 'a',
    title: 'Link Button',
    linkUrl: '#',
  },
};

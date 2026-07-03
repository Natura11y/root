import type { Meta, StoryObj } from '@storybook/react-vite';
import ButtonIconOverText from '@lib/components/natura11y/button/ButtonIconOverText';

const meta = {
  title: 'React/Button Icon Over Text',
  component: ButtonIconOverText,
  tags: ['autodocs'],
  args: {
    tag: 'button',
    buttonType: 'button',
    iconHandle: 'home',
    label: 'Home',
    linkUrl: '#',
    iconUtilities: '',
    textUtilities: '',
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
    iconHandle: { control: 'text' },
    label: { control: 'text' },
    linkUrl: { control: 'text' },
    ariaLabel: { control: 'text' },
    ariaExpanded: { control: 'boolean' },
    iconUtilities: { control: 'text' },
    textUtilities: { control: 'text' },
    utilities: { control: 'text' },
    attributes: { control: false },
    onClick: { control: false },
  },
} satisfies Meta<typeof ButtonIconOverText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const StyledIcon: Story = {
  args: {
    iconUtilities: 'theme-primary border-radius-circle',
    textUtilities: 'text-color-link',
  },
};

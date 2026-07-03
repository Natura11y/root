import type { Meta, StoryObj } from '@storybook/react-vite';
import ButtonIconOnly from '@lib/components/natura11y/button/ButtonIconOnly';

const meta = {
  title: 'React/Components/Button Icon Only',
  component: ButtonIconOnly,
  tags: ['autodocs'],
  args: {
    tag: 'button',
    buttonType: 'button',
    iconHandle: 'home',
    linkUrl: '#',
    outline: false,
    ariaLabel: 'Home',
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
    linkUrl: { control: 'text' },
    outline: { control: 'boolean' },
    ariaLabel: { control: 'text' },
    ariaExpanded: { control: 'boolean' },
    utilities: { control: 'text' },
    attributes: { control: false },
    onClick: { control: false },
  },
} satisfies Meta<typeof ButtonIconOnly>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

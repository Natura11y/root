import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from '@lib/components/natura11y/button';
import ButtonIconOnly from '@lib/components/natura11y/button/ButtonIconOnly';
import ButtonIconOverText from '@lib/components/natura11y/button/ButtonIconOverText';
import VanillaExample from '../../utils/VanillaExample';
import buttonMarkup from './button.example.html?raw';

const buttonReactCode = `<Button
  tag="button"
  buttonType="button"
  title="Button"
/>

<Button
  tag="button"
  buttonType="button"
  title="Edit"
  iconStartHandle="edit"
/>

<Button
  tag="a"
  title="Learn more"
  linkUrl="#"
  iconEndHandle="arrow-right"
  utilities="button--disperse"
/>`;

const meta = {
  title: 'Button',
  component: Button,
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
  },
  parameters: {
    docs: {
      codePanel: true,
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HTML: Story = {
  parameters: {
    docs: {
      source: {
        code: buttonMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => <VanillaExample html={buttonMarkup} />,
};

export const React: Story = {
  parameters: {
    docs: {
      source: {
        code: buttonReactCode,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};

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

export const IconOnly: Story = {
  name: 'Icon Only',
  render: () => (
    <ButtonIconOnly
      iconHandle='home'
      ariaLabel='Home'
    />
  ),
};

export const IconOverText: Story = {
  name: 'Icon Over Text',
  render: () => (
    <ButtonIconOverText
      iconHandle='home'
      label='Home'
    />
  ),
};

export const IconOverTextStyled: Story = {
  name: 'Icon Over Text Styled',
  render: () => (
    <ButtonIconOverText
      iconHandle='home'
      label='Home'
      iconUtilities='theme-primary border-radius-circle'
      textUtilities='text-color-link'
    />
  ),
};

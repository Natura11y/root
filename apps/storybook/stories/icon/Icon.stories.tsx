import type { Meta, StoryObj } from '@storybook/react-vite';
import { natura11yIcons } from '@natura11y/icons/src/data/icons.mjs';
import Icon from '@lib/components/icon';
import VanillaExample from '../../utils/VanillaExample';
import iconMarkup from './icon.example.html?raw';

const meta = {
  title: 'Icon',
  component: Icon,
  args: {
    iconHandle: 'home',
    utilities: 'font-size-lg',
  },
  argTypes: {
    iconHandle: { control: 'text' },
    utilities: { control: 'text' },
  },
  parameters: {
    docs: {
      codePanel: true,
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HTML: Story = {
  parameters: {
    docs: {
      source: {
        code: iconMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => <VanillaExample html={iconMarkup} />,
};

export const React: Story = {};

export const IconSet: Story = {
  name: 'Icon Set',
  render: () => (
    <div className='grid grid--column-3 grid--column-4--md grid--column-8--lg gap-3'>
      {natura11yIcons.map((icon) => (
        <div key={icon.className} className='display-flex flex-direction-column align-items-center gap-1 padding-2 border-radius subtle-fill-1 text-align-center'>
          <Icon iconHandle={icon.className} utilities='font-size-lg' />
          <span className='font-size-sm font-weight-bold'>{icon.icon}</span>
          <code className='font-size-sm'>{`.icon-${icon.className}`}</code>
        </div>
      ))}
    </div>
  ),
};

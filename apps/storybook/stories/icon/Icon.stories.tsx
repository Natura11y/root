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

const icons = [...natura11yIcons].sort((a, b) => a.icon.localeCompare(b.icon));

const sourceParameters = (markup: string) => ({
  docs: {
    source: {
      code: markup.trim(),
      language: 'html',
      type: 'code',
    },
  },
});

export const DefaultHtml: Story = {
  name: 'Default (HTML)',
  parameters: sourceParameters(iconMarkup),
  render: () => <VanillaExample html={iconMarkup} />,
};

export const DefaultReact: Story = {
  name: 'Default (React)',
  parameters: {
    docs: {
      source: {
        code: `<Icon iconHandle="home" utilities="font-size-lg" />`,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};

export const IconLibrary: Story = {
  name: 'Icon Library',
  render: () => (
    <div className='grid grid--column-3 grid--column-4--md grid--column-8--lg gap-3'>
      {icons.map((icon) => (
        <div key={icon.className} className='display-flex flex-direction-column align-items-center gap-1 padding-2 subtle-fill-1 border text-align-center'>
          <span className={`icon icon-${icon.className} font-size-lg`} aria-hidden='true' />
          <span className='font-size-sm font-weight-bold'>{icon.icon}</span>
          <code className='font-size-sm'>{`.icon-${icon.className}`}</code>
        </div>
      ))}
    </div>
  ),
};

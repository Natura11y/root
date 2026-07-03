import type { Meta, StoryObj } from '@storybook/react-vite';
import Icon from '@lib/components/natura11y/icon';

const iconSamples = [
  'home',
  'settings',
  'bell',
  'calendar',
  'search',
  'menu',
  'close',
  'open-new',
  'car',
  'map-pin',
];

const meta = {
  title: 'Icon',
  component: Icon,
  tags: ['autodocs'],
  args: {
    iconHandle: 'home',
    utilities: 'font-size-lg',
  },
  argTypes: {
    iconHandle: { control: 'text' },
    utilities: { control: 'text' },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const React: Story = {};

export const IconSet: Story = {
  name: 'Icon Set',
  render: () => (
    <div className='grid grid--column-4--md gap-3'>
      {iconSamples.map((iconHandle) => (
        <div key={iconHandle} className='display-flex flex-direction-column align-items-center padding-3 border-radius theme-light'>
          <Icon iconHandle={iconHandle} utilities='font-size-lg margin-bottom-2' />
          <code className='font-size-sm'>{iconHandle}</code>
        </div>
      ))}
    </div>
  ),
};

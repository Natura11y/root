import type { Meta, StoryObj } from '@storybook/react-vite';
import Badge from './index';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    tag: {
      control: 'radio',
      options: ['span', 'a', 'button'],
    },
    iconHandle: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'New',
  },
};

export const WithIcon: Story = {
  args: {
    iconHandle: 'check',
    children: 'Verified',
  },
};

export const AsLink: Story = {
  args: {
    tag: 'a',
    children: 'View more',
  },
};

export const Group: Story = {
  render: () => (
    <div className='flex-row gap-2'>
      <Badge>New</Badge>
      <Badge utilities='text-color-primary'>Featured</Badge>
      <Badge utilities='text-color-green'>Active</Badge>
      <Badge utilities='text-color-red'>Deprecated</Badge>
    </div>
  ),
};

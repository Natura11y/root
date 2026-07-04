import type { Meta, StoryObj } from '@storybook/react-vite';
import Badge from '@lib/components/badge';
import VanillaExample from '../../utils/VanillaExample';
import badgeMarkup from './badge.example.html?raw';

const meta: Meta<typeof Badge> = {
  title: 'Badge',
  component: Badge,
  argTypes: {
    tag: {
      control: 'radio',
      options: ['span', 'a', 'button'],
    },
    iconHandle: { control: 'text' },
  },
  parameters: {
    docs: {
      codePanel: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const HTML: Story = {
  parameters: {
    docs: {
      source: {
        code: badgeMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => <VanillaExample html={badgeMarkup} />,
};

export const React: Story = {
  args: {
    children: 'New',
  },
};

export const WithIcon: Story = {
  args: {
    iconHandle: 'confirm',
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

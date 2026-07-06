import type { Meta, StoryObj } from '@storybook/react-vite';
import Badge from '@lib/components/badge';
import VanillaExample from '../../utils/VanillaExample';
import badgeMarkup from './badge.example.html?raw';
import badgeInContextMarkup from './badge-in-context.example.html?raw';
import badgeWithIconMarkup from './badge-with-icon.example.html?raw';

const meta: Meta<typeof Badge> = {
  title: 'Badge',
  component: Badge,
  argTypes: {
    tag: {
      control: 'radio',
      options: ['span', 'a', 'button'],
    },
    iconHandle: { control: 'text' },
    utilities: { control: 'text' },
  },
  parameters: {
    docs: {
      codePanel: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const DefaultHtml: Story = {
  name: 'Default (HTML)',
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
    children: 'Default',
  },
};

export const WithIconHtml: Story = {
  name: 'With Icon (HTML)',
  parameters: {
    docs: {
      source: {
        code: badgeWithIconMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => <VanillaExample html={badgeWithIconMarkup} />,
};

export const WithIconReact: Story = {
  name: 'With Icon (React)',
  args: {
    iconHandle: 'bell',
    children: 'Alerts',
  },
};

export const InContextHtml: Story = {
  name: 'In Context (HTML)',
  parameters: {
    docs: {
      source: {
        code: badgeInContextMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => <VanillaExample html={badgeInContextMarkup} />,
};

export const InContextReact: Story = {
  name: 'In Context (React)',
  render: () => (
    <ul className='nav nav--divider' style={{ maxWidth: '240px' }}>
      <li>
        <a href='#1'>Home</a>
      </li>
      <li>
        <a href='#1'>
          <span className='text'>Inbox</span>
          <Badge utilities='theme-primary'>4</Badge>
        </a>
      </li>
      <li>
        <a href='#1'>
          <span className='text'>Notifications</span>
          <Badge utilities='theme-secondary'>12</Badge>
        </a>
      </li>
      <li>
        <a href='#1'>Archive</a>
      </li>
    </ul>
  ),
};

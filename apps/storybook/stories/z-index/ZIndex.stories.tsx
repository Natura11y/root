import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import VanillaExample from '../../utils/VanillaExample';
import markup from './z-index.example.html?raw';

const exampleStyle = {
  '--primary': '#440381',
  '--secondary': '#ffcc66',
  '--dark': '#161124',
  '--light': '#f2edeb',
  '--canvas': '#ffffff',
  '--primary-text': 'white',
  '--secondary-text': 'var(--dark)',
  '--body-font-family': 'Source Sans Pro',
  '--body-line-height': '1.5',
  fontFamily: 'var(--body-font-family)',
  lineHeight: 'var(--body-line-height)',
} as CSSProperties;

const meta = {
  title: 'Z-index',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component: 'Z-index utilities provide predictable stacking values for positioned interface layers.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: markup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => (
    <div style={exampleStyle}>
      <VanillaExample html={markup} />
    </div>
  ),
};

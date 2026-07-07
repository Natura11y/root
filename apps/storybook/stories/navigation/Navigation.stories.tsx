import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import defaultMarkup from './navigation-default.example.html?raw';
import horizontalMarkup from './navigation-horizontal.example.html?raw';
import justificationMarkup from './navigation-justification.example.html?raw';
import dividerMarkup from './navigation-divider.example.html?raw';
import iconsMarkup from './navigation-icons.example.html?raw';

const meta = {
  title: 'Navigation',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component: 'Navigation provides the shared list structure used by menus, actions, dividers, and icon links.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const createNavigationStory = (markup: string): Story => ({
  parameters: {
    docs: {
      source: {
        code: markup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => <VanillaExample html={markup} />,
});

export const Default: Story = createNavigationStory(defaultMarkup);

export const Horizontal: Story = createNavigationStory(horizontalMarkup);

export const Justification: Story = createNavigationStory(justificationMarkup);

export const Divider: Story = createNavigationStory(dividerMarkup);

export const IconsInNav: Story = {
  name: 'Icons in Nav',
  ...createNavigationStory(iconsMarkup),
};

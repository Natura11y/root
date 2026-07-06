import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import prefersMarkup from './color-prefers.example.html?raw';
import responsiveMarkup from './color-responsive.example.html?raw';
import themeMarkup from './color-theme.example.html?raw';
import utilitiesMarkup from './color-utilities.example.html?raw';

const meta = {
  title: 'Color',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component:
          'Natura11y color is a CSS theme system. Theme classes set background, text, border, link, confirm, and warn colors for their descendants; utility classes can apply individual background, text, and subtle fill colors.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const htmlStory = (markup: string): Story => ({
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

export const ThemesHtml: Story = {
  ...htmlStory(themeMarkup),
  name: 'Themes (HTML)',
};

export const Responsive: Story = {
  ...htmlStory(responsiveMarkup),
  name: 'Responsive Themes',
};

export const Prefers: Story = {
  ...htmlStory(prefersMarkup),
  name: 'Prefers Color Scheme',
};

export const Utilities: Story = {
  ...htmlStory(utilitiesMarkup),
  name: 'Color Utilities',
};

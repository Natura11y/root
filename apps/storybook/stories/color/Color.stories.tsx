import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import nestedMarkup from './color-nested.example.html?raw';
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

const htmlStory = (markup: string, name?: string): Story => ({
  name,
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

export const HTML = htmlStory(themeMarkup);

export const Utilities = htmlStory(utilitiesMarkup);

export const NestedThemes = htmlStory(nestedMarkup, 'Nested Themes');

export const Responsive = htmlStory(responsiveMarkup);

export const Prefers = htmlStory(prefersMarkup);

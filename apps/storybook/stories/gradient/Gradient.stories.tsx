import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import directionalMarkup from './gradient.example.html?raw';
import themeMarkup from './gradient-theme.example.html?raw';
import vignetteMarkup from './gradient-vignette.example.html?raw';

const meta = {
  title: 'Gradient',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component: 'Gradient mask utilities fade media and visual layers into surrounding theme colors.',
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

export const Directional: Story = {
  ...htmlStory(directionalMarkup),
};

export const ThemeBlend: Story = {
  ...htmlStory(themeMarkup),
  name: 'Theme Blend',
};

export const Vignette: Story = {
  ...htmlStory(vignetteMarkup),
};

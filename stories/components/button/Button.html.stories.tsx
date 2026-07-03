import type { Meta, StoryObj } from '@storybook/react-vite';

const buttonMarkup = `
  <div class="display-flex flex-wrap gap-2">
    <a class="button" href="#1">
      <span class="icon icon-heart" aria-hidden="true"></span>
      <span class="text">Label</span>
    </a>

    <a class="button button--outline" href="#1">
      <span class="icon icon-lock" aria-hidden="true"></span>
      <span class="text">Label</span>
    </a>

    <a class="button button--disperse width-100" href="#1">
      <span class="text">Label</span>
      <span class="icon icon-arrow-right" aria-hidden="true"></span>
    </a>
  </div>
`;

const meta = {
  title: 'Components/Button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Rendered as Natura11y HTML using the shared core Sass and icon font loaded by the Storybook app.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const HTML: Story = {
  render: () => (
    <div dangerouslySetInnerHTML={{ __html: buttonMarkup }} />
  ),
};

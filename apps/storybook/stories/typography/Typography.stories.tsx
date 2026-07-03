import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import articleMarkup from './typography-article.example.html?raw';
import overviewMarkup from './typography-overview.example.html?raw';

const displayFontSizes = (container: HTMLDivElement) => {
  container.querySelectorAll<HTMLElement>('.display-fs').forEach((element) => {
    if (element.firstElementChild?.classList.contains('display-fs__text')) return;

    element.classList.add('flex-row', 'align-items-baseline', 'gap-3');

    const fontSize = Math.round(parseFloat(window.getComputedStyle(element).fontSize));
    const fontSizeDisplay = document.createElement('span');
    fontSizeDisplay.className = 'display-fs__text font-weight-normal opacity-70 font-size-sm';
    fontSizeDisplay.textContent = `${fontSize}px `;

    const textWrapper = document.createElement('span');
    textWrapper.innerHTML = element.innerHTML;

    element.innerHTML = '';
    element.appendChild(fontSizeDisplay);
    element.appendChild(textWrapper);
  });
};

const meta = {
  title: 'Typography',
  parameters: {
    docs: {
      codePanel: true,
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const HTML: Story = {
  parameters: {
    docs: {
      source: {
        code: overviewMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => (
    <VanillaExample html={overviewMarkup} initialize={displayFontSizes} />
  ),
};

export const ArticleText: Story = {
  name: 'Prose',
  parameters: {
    docs: {
      source: {
        code: articleMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => <VanillaExample html={articleMarkup} />,
};

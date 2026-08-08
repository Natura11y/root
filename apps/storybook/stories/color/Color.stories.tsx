import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import prefersMarkup from './color-prefers.example.html?raw';
import responsiveMarkup from './color-responsive.example.html?raw';
import themeMarkup from './color-theme.example.html?raw';
import utilitiesMarkup from './color-utilities.example.html?raw';
import './correlated-colors.scss';
import './principal-palette.scss';

const themeColors = [
  { label: 'Primary', name: 'primary' },
  { label: 'Secondary', name: 'secondary' },
  { label: 'Dark', name: 'dark' },
  { label: 'Light', name: 'light' },
  { label: 'Canvas (default)', name: 'canvas' },
] as const;

const correlatedColors = [
  { label: 'Text', name: 'text' },
  { label: 'Border', name: 'border' },
  { label: 'Link', name: 'link' },
  { label: 'Confirm', name: 'confirm' },
  { label: 'Warn', name: 'warn' },
] as const;

type CssVariableValueProps = {
  name: string;
};

const CssVariableValue = ({ name }: CssVariableValueProps) => {
  const [value, setValue] = useState(`var(${name})`);

  useEffect(() => {
    const declaredValue = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();

    if (declaredValue) setValue(declaredValue);
  }, [name]);

  return <code>{value}</code>;
};

type ColorSwatchProps = {
  className?: string;
  variableName: string;
};

const ColorSwatch = ({
  className = 'correlated-colors__swatch',
  variableName,
}: ColorSwatchProps) => (
  <span
    aria-hidden='true'
    className={className}
    style={{ backgroundColor: `var(${variableName})` }}
  />
);

const PrincipalPaletteReference = () => (
  <section
    aria-labelledby='principal-palette-title'
    className='principal-palette'
  >
    <div className='principal-palette__introduction'>
      <h2 className='h3' id='principal-palette-title'>
        Principal palette
      </h2>
      <p>
        These five Core colors establish Natura11y&apos;s theme palette. See the{' '}
        <a href='https://gonatura11y.com/docs/color/#theme-colors' target='_blank' rel='noreferrer'>
          complete Principal Palette documentation
        </a>{' '}
        for usage guidance.
      </p>
    </div>

    <article className='card theme-canvas border border-radius-2 principal-palette__card'>
      <div className='principal-palette__table-scroll'>
        <table className='table principal-palette__table'>
          <caption className='screen-reader-only'>
            Natura11y principal palette values
          </caption>
          <thead>
            <tr>
              <th className='screen-reader-only' scope='col'>Swatch</th>
              <th scope='col'>Theme</th>
              <th scope='col'>CSS property</th>
              <th scope='col'>Value</th>
            </tr>
          </thead>
          <tbody>
            {themeColors.map((theme) => {
              const variableName = `--${theme.name}`;

              return (
                <tr key={theme.name}>
                  <td className='principal-palette__swatch-cell'>
                    <ColorSwatch
                      className='principal-palette__swatch'
                      variableName={variableName}
                    />
                  </td>
                  <th scope='row'>{theme.label}</th>
                  <td><code>{variableName}</code></td>
                  <td className='principal-palette__value'>
                    <CssVariableValue name={variableName} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </article>
  </section>
);

const CorrelatedColorReference = () => (
  <section
    aria-labelledby='correlated-colors-title'
    className='correlated-colors'
  >
    <div className='correlated-colors__introduction'>
      <h2 className='h3' id='correlated-colors-title'>
        Correlated color values
      </h2>
      <p>
        These are the CSS custom properties currently loaded from
        {' '}<code>@natura11y/core</code>. See the{' '}
        <a href='https://gonatura11y.com/docs/color/' target='_blank' rel='noreferrer'>
          complete Color documentation
        </a>{' '}
        for usage and accessibility guidance.
      </p>
    </div>

    <div className='correlated-colors__grid'>
      {themeColors.map((theme) => {
        const principalVariable = `--${theme.name}`;

        return (
          <article
            className={`card theme-${theme.name} border border-radius-2 correlated-colors__card`}
            key={theme.name}
          >
            <div className='correlated-colors__table-scroll'>
              <table className='table correlated-colors__table'>
                <caption>
                  <span className='correlated-colors__caption'>
                    <strong>{theme.label}</strong>
                    <span>
                      <code>{principalVariable}</code>
                      {' '}
                      <CssVariableValue name={principalVariable} />
                    </span>
                  </span>
                </caption>
                <thead>
                  <tr>
                    <th className='screen-reader-only' scope='col'>Swatch</th>
                    <th scope='col'>Role</th>
                    <th scope='col'>CSS property</th>
                    <th scope='col'>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {correlatedColors.map((correlation) => {
                    const variableName = `--${theme.name}-${correlation.name}`;

                    return (
                      <tr key={correlation.name}>
                        <td className='correlated-colors__swatch-cell'>
                          <ColorSwatch variableName={variableName} />
                        </td>
                        <th scope='row'>{correlation.label}</th>
                        <td><code>{variableName}</code></td>
                        <td className='correlated-colors__value'>
                          <CssVariableValue name={variableName} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </article>
        );
      })}
    </div>
  </section>
);

const meta = {
  title: 'Color',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component:
          'Natura11y color is a CSS theme system. Theme classes set background, text, border, link, confirm, and warn colors for their descendants; utility classes can apply individual background, text, and subtle fill colors. See the [complete Color documentation](https://gonatura11y.com/docs/color/) for guidance, accessibility considerations, and the full system reference.',
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

export const PrincipalPalette: Story = {
  name: 'Principal Palette',
  parameters: {
    docs: {
      description: {
        story:
          'The five principal theme colors currently loaded from Natura11y Core. These colors establish the palette used by theme, background, text, and border utilities.',
      },
      source: {
        code: `<div class="theme-primary">Primary</div>
<div class="theme-secondary">Secondary</div>
<div class="theme-dark">Dark</div>
<div class="theme-light">Light</div>
<div class="theme-canvas">Canvas (default)</div>`,
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => <PrincipalPaletteReference />,
};

export const CorrelatedColors: Story = {
  name: 'Correlated Color Values',
  parameters: {
    docs: {
      description: {
        story:
          'A compact implementation reference for the five correlated colors belonging to each Natura11y theme. Values are read from the Core CSS loaded by Storybook.',
      },
      source: {
        code: `.theme-primary {
  --background-color: var(--primary);
  --text-color: var(--primary-text);
  --border-color: var(--primary-border);
  --link-color: var(--primary-link);
  --confirm-color: var(--primary-confirm);
  --warn-color: var(--primary-warn);
}`,
        language: 'css',
        type: 'code',
      },
    },
  },
  render: () => <CorrelatedColorReference />,
};

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

import { defineEcConfig } from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';

export default defineEcConfig({
  plugins: [pluginLineNumbers()],
  frames: {
    showCopyToClipboardButton: false,
  },
  themes: ['github-light', 'github-dark'],
  defaultProps: {
    showLineNumbers: false,
  },
  styleOverrides: {
    borderRadius: '0',
    borderWidth: '0',
    codeBackground: 'transparent',
    codeFontFamily: 'var(--code-font-family)',
    codeFontSize: 'var(--font-size-md)',
    codeLineHeight: 'var(--code-line-height)',
    codePaddingBlock: 'var(--code-padding-block)',
    codePaddingInline: 'var(--container-padding-x)',
    gutterForeground: 'var(--code-gutter-foreground-color)',
    gutterHighlightForeground: 'var(--code-gutter-highlight-foreground-color)',
    gutterBorderWidth: '0',
    textMarkers: {
      lineMarkerAccentWidth: '0',
      inlineMarkerBorderRadius: 'var(--code-inline-marker-border-radius)',
      inlineMarkerBorderWidth: 'var(--code-inline-marker-border-width)',
      inlineMarkerPadding: 'var(--code-inline-marker-padding)',
      markBackground: 'var(--code-marker-background-color)',
      markBorderColor: 'var(--code-marker-border-color)',
    },
    frames: {
      editorBackground: 'transparent',
      editorTabBarBackground: 'transparent',
      editorTabBarBorderBottomColor: 'transparent',
      editorActiveTabBackground: 'var(--code-background-color)',
      editorActiveTabBorderColor: 'transparent',
      editorActiveTabIndicatorBottomColor: 'transparent',
      editorActiveTabIndicatorHeight: 'var(--tab-nav-active-bar-size)',
      editorActiveTabIndicatorTopColor: 'var(--tab-nav-active-bar-color)',
      frameBoxShadowCssValue: 'none',
    },
  },
  customizeTheme(theme) {
    if (theme.name === 'github-light') {
      theme.name = 'light';
    }

    if (theme.name === 'github-dark') {
      theme.name = 'dark';
    }
  },
});

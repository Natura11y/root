import { defineEcConfig } from 'astro-expressive-code';

export default defineEcConfig({
  themes: ['github-light', 'github-dark'],
  customizeTheme(theme) {
    if (theme.name === 'github-light') {
      theme.name = 'light';
    }

    if (theme.name === 'github-dark') {
      theme.name = 'dark';
    }
  },
});

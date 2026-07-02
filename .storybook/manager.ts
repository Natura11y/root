import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';
import naturallyLogo from '../naturally-logo.svg';

addons.setConfig({
  theme: {
    ...themes.light,
    brandTitle: 'Natura11y React',
    brandUrl: 'https://gonatura11y.com/',
    brandImage: naturallyLogo,
  },
});

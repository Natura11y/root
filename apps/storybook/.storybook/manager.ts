import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';
import naturallyLogo from '../../../logo-natura11y.svg';

addons.setConfig({
  theme: {
    ...themes.light,
    brandTitle: 'Natura11y',
    brandImage: naturallyLogo,
  },
});

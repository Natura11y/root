/*

In this file:

// A. Polyfills
// B. Modules

*/

//////////////////////////////////////////////
// A. Polyfills
//////////////////////////////////////////////

import 'element-closest-polyfill';

//////////////////////////////////////////////
// B. Modules
//////////////////////////////////////////////

import './modules/accents';

import Accessibility from './modules/accessibility';
new Accessibility();

import Accordion from './modules/accordion';
new Accordion();

import Alerts from './modules/alerts';
new Alerts();

import './modules/article';

import './modules/aspect-ratios';

import './modules/backdrops';

import './modules/borders';

import './modules/breakpoints';

import Buttons from './modules/buttons';
new Buttons();

import './modules/cards';

import Collapse from './modules/collapse';
new Collapse();

import './modules/color';

import './modules/containers';

import './modules/display';

import Document from './modules/document';
new Document();

import './modules/flex';

import Forms from './modules/forms';
new Forms();

import './modules/grid';

import './modules/icons';

import './modules/links';

import Modal from './modules/modal';
new Modal();

import Navigation from './modules/navigation';
new Navigation();

import './modules/opacity';

import './modules/overflow';

import './modules/position';

import './modules/shadows';

import './modules/sizing';

import './modules/spacing';

import Tabs from './modules/tabs';
new Tabs();

import Tables from './modules/tables';
new Tables();

import './modules/typography';

import './modules/z-index/index';
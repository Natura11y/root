/*

In this file:

// A. Module Imports
// B. Initialize JS Modules

*/

import { isElementLoaded } from './utilities/element'; 

//////////////////////////////////////////////
// A. Module Imports
//////////////////////////////////////////////

import './modules/accents';

import './modules/accessibility';

import Accordion from './modules/accordion';

import Alerts from './modules/alerts';

import './modules/article';

import './modules/aspect-ratios';

import './modules/backdrops';

import './modules/borders';

import './modules/breakpoints';

import Buttons from './modules/buttons';

import './modules/cards';

import Collapse from './modules/collapse';

import './modules/color';

import './modules/containers';

import './modules/display';

import './modules/document';

import './modules/flex';

import Forms from './modules/forms';

import './modules/grid';

import './modules/icons';

import './modules/links';

import Modal from './modules/modal';

import Navigation from './modules/navigation';

import './modules/opacity';

import './modules/overflow';

import './modules/position';

import './modules/shadows';

import './modules/sizing';

import './modules/spacing';

import Tabs from './modules/tabs';

import Tables from './modules/tables';

import './modules/typography';

import './modules/z-index/index';

//////////////////////////////////////////////
// B. Initialize JS Modules
//////////////////////////////////////////////

const accordion = new Accordion();
isElementLoaded('.accordion').then((els) => accordion.init(els));

const alerts = new Alerts();
alerts.init();

const buttons = new Buttons();
buttons.init();

const collapse = new Collapse();
collapse.init();

const forms = new Forms();
forms.init();

const modal = new Modal();
modal.init();

const navigation = new Navigation();
navigation.init();

const tabs = new Tabs();
tabs.init();

const tables = new Tables();
tables.init();
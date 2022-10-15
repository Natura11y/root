/*

In this file:

// A. SCSS
// B. JS

*/

//////////////////////////////////////////////
// A. SCSS
//////////////////////////////////////////////

import './scss/accent.scss';
import './scss/accessibility.scss';
import './scss/accordion.scss';
import './scss/alert.scss';
import './scss/article.scss';
import './scss/aspect-ratio.scss';
import './scss/backdrop.scss';
import './scss/border.scss';
import './scss/breakpoints.scss';
import './modules/button.scss';
import './modules/card.scss';
import './modules/collapse.scss';
import './modules/color.scss';
import './modules/container.scss';
import './modules/display.scss';
import './modules/document.scss';
import './modules/flex.scss';
import './modules/form.scss';
import './modules/grid.scss';
import './modules/icon.scss';
import './modules/link.scss';
import './modules/modal.scss';
import './modules/navigation.scss';
import './modules/opacity.scss';
import './modules/overflow.scss';
import './modules/position.scss';
import './modules/shadow.scss';
import './modules/sizing.scss';
import './modules/spacing.scss';
import './modules/tab.scss';
import './modules/table.scss';
import './modules/typography.scss';
import './modules/z-index.scss';

//////////////////////////////////////////////
// B. JS
//////////////////////////////////////////////

import Accordion from './js/accordion';
const accordion = new Accordion();
accordion.init();

import Alert from './js/accordion';
const alert = new Alert();
alert.init();

import Button from './js/button';
const button = new Button();
button.init();

import Collapse from './js/collapse'
const collapse = new Collapse();
collapse.init();

import Form from './js/form';
const form = new Form();
form.init();

import Modal from './js/modal';
const modal = new Modal();
modal.init();

import Navigation from './js/navigation';
const navigation = new Navigation();
navigation.init();

import Table from './js/table';
const table = new Table();
table.init();

import Tab from './js/tab';
const tab = new Tab();
tab.init();
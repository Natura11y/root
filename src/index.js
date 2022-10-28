/*

In this file:

// A. SCSS
// B. JS

*/

//////////////////////////////////////////////
// A. SCSS
//////////////////////////////////////////////

import './scss/accessibility.scss';
import './scss/accordion.scss';
import './scss/alert.scss';
import './scss/article.scss';
import './scss/aspect-ratio.scss';
import './scss/backdrop.scss';
import './scss/border.scss';
import './scss/breakpoint.scss';
import './scss/button.scss';
import './scss/card.scss';
import './scss/collapse.scss';
import './scss/color.scss';
import './scss/container.scss';
import './scss/display.scss';
import './scss/document.scss';
import './scss/flex.scss';
import './scss/form.scss';
import './scss/grid.scss';
import './scss/icon.scss';
import './scss/link.scss';
import './scss/modal.scss';
import './scss/navigation.scss';
import './scss/opacity.scss';
import './scss/overflow.scss';
import './scss/position.scss';
import './scss/shadow.scss';
import './scss/sizing.scss';
import './scss/spacing.scss';
import './scss/tab.scss';
import './scss/table.scss';
import './scss/typography.scss';
import './scss/z-index.scss';

//////////////////////////////////////////////
// B. JS
//////////////////////////////////////////////

import Accordion from './js/accordion';
const accordion = new Accordion();
accordion.init();

import Alert from './js/alert';
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
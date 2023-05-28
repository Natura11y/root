/*

In this file:

// A. SCSS
// B. JS

*/

//////////////////////////////////////////////
// A. SCSS
//////////////////////////////////////////////

import './scss/natura11y.scss';

//////////////////////////////////////////////
// B. JS
//////////////////////////////////////////////

import Accordion from './js/accordion';
const accordion = new Accordion();
accordion.render();

import AlertDismissable from './js/alert';
const alertDismissable = new AlertDismissable();
alertDismissable.render();

import Button from './js/button';
const button = new Button();
button.render();

import Collapse from './js/collapse'
const collapse = new Collapse();
collapse.render();

import FormInputs, { FormSubmission, FormFileUpload } from './js/form';

const formInputs = new FormInputs();
const formSubmission = new FormSubmission();
const formFileUpload = new FormFileUpload();

formInputs.render();
formSubmission.render();
formFileUpload.render();

import Lightbox from './js/lightbox';
const lightbox = new Lightbox();
lightbox.render();

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
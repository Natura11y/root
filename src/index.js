//////////////////////////////////////////////
// A. SCSS
//////////////////////////////////////////////

import './scss/natura11y.scss';

//////////////////////////////////////////////
// B. JS
//////////////////////////////////////////////

import Accordion from './js/accordion';
import AlertDismissable from './js/alert';
import Button from './js/button';
import Collapse from './js/collapse';
import FormInput, { FormSubmission, FormFileUpload } from './js/form';
import Lightbox from './js/lightbox';
import Modal from './js/modal';
import Navigation from './js/navigation';
import Table from './js/table';
import Tab from './js/tab';

//////////////////////////////////////////////
// C. Class Instantiation
//////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {

  const accordion = new Accordion();
  accordion.render();

  const alertDismissable = new AlertDismissable();
  alertDismissable.render();

  const button = new Button();
  button.render();

  const collapse = new Collapse();
  collapse.render();

  const formInput = new FormInput();
  formInput.render();

  const formSubmission = new FormSubmission();
  formSubmission.render();
  
  const formFileUpload = new FormFileUpload();
  formFileUpload.render();

  const lightbox = new Lightbox();
  lightbox.render();

  const modal = new Modal();
  modal.render();

  const navigation = new Navigation();
  navigation.render();

  const table = new Table();
  table.render();

  const tab = new Tab();
  tab.render();

});
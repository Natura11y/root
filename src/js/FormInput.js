export default class FormInput {

  constructor() {
    this.formEntryList = document.querySelectorAll('.form-entry');
  }

  handleFormInputs(formEntry) {
    const formEntryInput = formEntry.querySelector('.form-entry__input');
    const isRequired = formEntryInput.hasAttribute('required');

    this.processFormEntryInput(formEntryInput, isRequired);

    formEntryInput.addEventListener('focusin', (event) =>
      this.handleFocusIn(event.target)
    );

    formEntryInput.addEventListener('focusout', (event) =>
      this.handleFocusOut(event.target)
    );

    formEntryInput.addEventListener('change', (event) =>
      this.handleInputChange(event.target, isRequired)
    );

    formEntryInput.addEventListener('click', (event) =>
      this.handleClickOnInputText(event)
    );
  }

  processFormEntryInput(formEntryInput, isRequired) {
    if (isRequired && formEntryInput.value === '') {
      formEntryInput.closest('.form-entry').classList.add('is-invalid');
    } else {
      formEntryInput.closest('.form-entry').classList.remove('is-invalid');
    }
  }

  handleFocusIn(activeTarget) {
    const parent = activeTarget.closest('.form-entry');
    parent.classList.add('active');
    parent.classList.remove('is-invalid');
  }

  handleFocusOut(activeTarget) {
    activeTarget.closest('.form-entry').classList.remove('active');
  }

  handleInputChange(formEntryInput, isRequired) {
    this.processFormEntryInput(formEntryInput, isRequired);
  }

  handleClickOnInputText(event) {
    event.target.select();
  }

  init() {
    this.formEntryList.forEach((formEntry) =>
      this.handleFormInputs(formEntry)
    );
  }
}
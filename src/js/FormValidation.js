export default class FormValidation {

  constructor() {
    this.invalidClasses = ['is-invalid'];
    this.formSubmitAttempted = false;
  }

  isEmpty(value = null) {
    return value === '';
  }

  setInvalid(field) {
    let entryRoot = field.closest('.form-entry');
    entryRoot.classList.add(...this.invalidClasses);
  }

  setValid(field) {
    let entryRoot = field.closest('.form-entry');
    entryRoot.classList.remove(...this.invalidClasses);
  }

  checkIfEmpty(field) {
    if (this.isEmpty(field.value)) {
      this.setInvalid(field);
      return true;
    } else {
      this.setValid(field);
      return false;
    }
  }


  #createErrorMessage(desc, inst) {
    if (desc === null) {
      desc = 'This field is Required';
    }
    return `
            <small class="form-entry__feedback">
                <span class="icon icon-warn" aria-hidden="true"></span>
                <span class="message">
                    <strong>${desc}</strong> ${inst !== undefined ? inst : ''}
                </span>
            </small>
        `;
  }
  
  handleFormSubmission(form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.formSubmitAttempted = true;

      let errorsArray = [];

      let formErrorsList = form.querySelectorAll(':invalid');

      this.processFormErrors(formErrorsList, errorsArray);

      if (errorsArray.length > 0) {
        event.preventDefault();
      }

      this.scrollToFirstError(form);
    });
  }

  processFormErrors(formErrorsList, errorsArray) {
    
    formErrorsList.forEach((formError) => {
      let formErrorEntry = formError.closest('.form-entry');
      let formErrorEntryLabel = formErrorEntry.querySelector('.form-entry__field__label');

      formErrorEntry.classList.add('is-invalid');

      const formEntryFeedback = formErrorEntry.querySelector('.form-entry__feedback');
      const formEntryHelp = formErrorEntry.querySelector('.form-entry__help');

      let entryHelpText;

      if (formEntryHelp) {
        entryHelpText = formEntryHelp.innerHTML.toString();
      }

      let errorMessage = formErrorEntry.getAttribute('data-error-message');
      let errorFeedback = [errorMessage, entryHelpText];

      errorsArray.push(errorFeedback);

      if (formEntryFeedback === null) {
        formErrorEntryLabel.insertAdjacentHTML(
          'afterend',
          this.#createErrorMessage(errorMessage, entryHelpText)
        );
      }
    });

  }

  scrollToFirstError(form) {
    let firstError = form.querySelector('[class*="alert"], [class*="invalid"]');
  
    if (firstError) {
      if (firstError.hasAttribute('data-alert')) {
        firstError.style.display = 'block';
      }
      let myScroll = firstError.offsetTop - 16;
  
      window.scrollTo({
        top: myScroll,
        behavior: 'smooth',
      });
    }
  }
  
}
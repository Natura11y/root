import { delegateEvent } from './utilities/eventDelegation';

//////////////////////////////////////////////
// A. Shared Methods & Base Class
//////////////////////////////////////////////

const isEmpty = (value) => !value?.trim();

const setFieldValidity = (field, isValid, invalidClasses = ['is-invalid']) => {
  const entryRoot = field.closest('.form-entry');
  entryRoot.classList.toggle(invalidClasses[0], !isValid);
  field.setAttribute('aria-invalid', !isValid);
};

// Base class for form components with common functionality
class FormBase {
  #invalidClasses = ['is-invalid'];
  #formSubmitAttempted = false;

  get invalidClasses() {
    return this.#invalidClasses;
  }

  get formSubmitAttempted() {
    return this.#formSubmitAttempted;
  }

  set formSubmitAttempted(value) {
    this.#formSubmitAttempted = value;
  }

  #checkIfEmpty(field) {
    const isFieldEmpty = isEmpty(field.value);
    setFieldValidity(field, !isFieldEmpty, this.#invalidClasses);
    return isFieldEmpty;
  }

  // Protected method for subclasses to use
  _checkIfEmpty(field) {
    return this.#checkIfEmpty(field);
  }

  // Helper method for common cleanup pattern
  _cleanupHandlers(handlersMap, removeEvent) {
    handlersMap.forEach((handler, element) => {
      if (typeof removeEvent === 'string') {
        element.removeEventListener(removeEvent, handler);
      } else {
        // For complex cleanup scenarios, pass a function
        removeEvent(element, handler);
      }
    });
    handlersMap.clear();
  }

  // Abstract method - subclasses must implement
  cleanup() {
    throw new Error('cleanup() must be implemented by subclass');
  }

  // Abstract method - subclasses must implement
  init() {
    throw new Error('init() must be implemented by subclass');
  }
}

//////////////////////////////////////////////
// B. Form Input 
//////////////////////////////////////////////

export default class FormInput extends FormBase {

  #formEntryList = document.querySelectorAll('.form-entry');
  #inputHandlers = new Map();
  #changeHandlers = new Map();
  #clickHandlers = new Map();

  // Private methods

  #handleInputChange(formEntryInput, isRequired) {
    // Check if empty or not if submission has already been attempted
    if (this.formSubmitAttempted && isRequired) {
      this._checkIfEmpty(formEntryInput);
    }

    // Toggle 'has-value' class based on input content
    formEntryInput.closest('.form-entry').classList.toggle('has-value', formEntryInput.value !== '');
  }

  // Attach input event listener to dynamically validate while typing
  #addDynamicValidation(formEntryInput) {
    // Remove existing handler if any
    const existingHandler = this.#inputHandlers.get(formEntryInput);
    if (existingHandler) {
      formEntryInput.removeEventListener('input', existingHandler);
    }

    const handler = () => {
      this._checkIfEmpty(formEntryInput); // Remove error if the field becomes valid
    };
    
    formEntryInput.addEventListener('input', handler);
    this.#inputHandlers.set(formEntryInput, handler);
  }

  #processFormEntryInput(formEntryInput, isRequired) {
    const isInputText = formEntryInput.closest('.form-entry').querySelector('.form-entry__field__input');

    if (isRequired) {
      formEntryInput.setAttribute('required', 'true');
      formEntryInput.setAttribute('aria-required', 'true');
    }

    // Add dynamic validation on input event (removes error class when user types)
    this.#addDynamicValidation(formEntryInput);

    // Handle input change on 'change' event
    const existingChangeHandler = this.#changeHandlers.get(formEntryInput);
    if (existingChangeHandler) {
      formEntryInput.removeEventListener('change', existingChangeHandler);
    }

    const changeHandler = () => this.#handleInputChange(formEntryInput, isRequired);
    formEntryInput.addEventListener('change', changeHandler);
    this.#changeHandlers.set(formEntryInput, changeHandler);

    // Handle click events on input text spans
    if (isInputText) {
      const existingClickHandler = this.#clickHandlers.get(isInputText);
      if (existingClickHandler) {
        isInputText.removeEventListener('click', existingClickHandler);
      }

      const clickHandler = this.#handleClickOnInputText;
      isInputText.addEventListener('click', clickHandler);
      this.#clickHandlers.set(isInputText, clickHandler);
    }
  }

  #handleClickOnInputText(event) {
    const clickInput = event.target.closest('.form-entry__field__input').querySelector('input');
    if (event.target.tagName === 'SPAN') clickInput.focus();
  }

  // Cleanup method to remove all event listeners
  cleanup() {
    this._cleanupHandlers(this.#inputHandlers, 'input');
    this._cleanupHandlers(this.#changeHandlers, 'change');
    this._cleanupHandlers(this.#clickHandlers, 'click');
  }

  // Public methods

  init() {
    this.#formEntryList.forEach((formEntry) => {
      const isRequired = formEntry.hasAttribute('data-required');
      const formEntryInputList = formEntry.querySelectorAll('input, select, textarea');
      
      // Process each form entry input
      formEntryInputList.forEach((formEntryInput) => this.#processFormEntryInput(formEntryInput, isRequired));

      // Scoped Event Delegation for focusin and focusout (within each formEntry)
      delegateEvent(formEntry, 'focusin', 'input, select, textarea', (event) => {
        this.#toggleFocusClass(event, true);
      });

      delegateEvent(formEntry, 'focusout', 'input, select, textarea', (event) => {
        this.#toggleFocusClass(event, false);
      });
    });
  }

  #toggleFocusClass(event, isFocused = true) {
    event.target.closest('.form-entry').classList.toggle('is-focused', isFocused);
  }
}

//////////////////////////////////////////////
// C. Form Submission 
//////////////////////////////////////////////

export class FormSubmission extends FormBase {
  #formList = document.querySelectorAll('form[novalidate]');
  #submitHandlers = new Map();

  #processFormErrors(formErrorsList, errorsArray) {
    formErrorsList.forEach((formError) => {
      const formEntry = formError.closest('.form-entry');
      const formEntryLabel = formEntry.querySelector('.form-entry__field__label');
      const errorMessage = formEntry.getAttribute('data-error-message') || 'This field is required';
      const helpText = formEntry.querySelector('.form-entry__help')?.innerHTML || '';

      errorsArray.push([errorMessage, helpText]);

      if (!formEntry.querySelector('.form-entry__feedback')) {
        formEntryLabel.insertAdjacentHTML('afterend', this.#createErrorMessage(errorMessage, helpText));
      }
    });
  }

  #createErrorMessage(desc, inst) {
    return `
      <small class="form-entry__feedback" role="alert">
        <span class="icon icon-warn" aria-hidden="true"></span>
        <span class="message">
          <strong>${desc}</strong> ${inst || ''}
        </span>
      </small>
    `;
  }

  #scrollToFirstError(form) {
    const firstError = form.querySelector('.is-invalid, [data-alert]');
    if (firstError) {
      window.scrollTo({ top: firstError.offsetTop - 16, behavior: 'smooth' });
    }
  }

  #handleFormSubmission(form) {
    // Remove existing handler if any
    const existingHandler = this.#submitHandlers.get(form);
    if (existingHandler) {
      form.removeEventListener('submit', existingHandler);
    }

    const handler = (event) => {
      event.preventDefault();
      this.formSubmitAttempted = true;
      const errorsArray = [];

      const inputFields = form.querySelectorAll('input, select, textarea');
      inputFields.forEach((field) => {
        if (field.hasAttribute('required')) {
          this._checkIfEmpty(field);
        }
      });

      const formErrorsList = form.querySelectorAll(':invalid');
      this.#processFormErrors(formErrorsList, errorsArray);

      if (errorsArray.length > 0) {
        event.preventDefault();
        this.#scrollToFirstError(form);
      }
    };

    form.addEventListener('submit', handler);
    this.#submitHandlers.set(form, handler);
  }

  // Cleanup method to remove all event listeners
  cleanup() {
    this._cleanupHandlers(this.#submitHandlers, 'submit');
  }

  init() {
    this.#formList.forEach((form) => this.#handleFormSubmission(form));
  }
}

//////////////////////////////////////////////
// D. Form File Upload
//////////////////////////////////////////////

export class FormFileUpload extends FormBase {
  #fileUploadList = document.querySelectorAll('.file-upload');
  #fileUploadHandlers = new Map();

  #handleFileChange(fileUpload) {
    return (event) => {
      const [file] = event.target.files;
      if (!file) return;
      const { name: fileName, size } = file;
      const fileSize = size >= 1e6 ? `${(size / 1e6).toFixed(2)} MB` : `${(size / 1e3).toFixed(2)} KB`;

      const fileUploadData = fileUpload.querySelector('.file-upload__data');
      if (fileUploadData) fileUploadData.remove();

      fileUpload.insertAdjacentHTML('beforeend', `
        <span class="file-upload__data">
          <span class="file-name">${fileName}</span>
          <span class="file-size">${fileSize}</span>
        </span>
      `);
    };
  }

  dragOver(event) {
    event.preventDefault();
    event.target.closest('.form-entry').classList.add('is-focused');
  }

  dragOff(event) {
    event.target.closest('.form-entry').classList.remove('is-focused');
  }

  dropped(fileUpload) {
    return (event) => {
      event.preventDefault();
      event.target.closest('.form-entry').classList.remove('is-focused');
      
      // Handle dropped files
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const fileInput = fileUpload.querySelector('input[type="file"]');
        fileInput.files = files;
        
        // Trigger change event to handle file display
        const changeEvent = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(changeEvent);
      }
    };
  }

  #handleFileUpload(fileUpload) {
    const fileUploadInput = fileUpload.querySelector('input[type="file"]');
    
    // Remove existing handlers if any
    const existingHandlers = this.#fileUploadHandlers.get(fileUpload);
    if (existingHandlers) {
      fileUploadInput.removeEventListener('change', existingHandlers.changeHandler);
      fileUpload.removeEventListener('dragenter', existingHandlers.dragenterHandler);
      fileUpload.removeEventListener('dragover', existingHandlers.dragoverHandler);
      fileUpload.removeEventListener('dragleave', existingHandlers.dragleaveHandler);
      fileUpload.removeEventListener('dragend', existingHandlers.dragendHandler);
      fileUpload.removeEventListener('drop', existingHandlers.dropHandler);
    }

    // Create new handlers
    const changeHandler = this.#handleFileChange(fileUpload);
    const dragenterHandler = this.dragOver.bind(this);
    const dragoverHandler = this.dragOver.bind(this);
    const dragleaveHandler = this.dragOff.bind(this);
    const dragendHandler = this.dragOff.bind(this);
    const dropHandler = this.dropped(fileUpload);

    // Add new handlers
    fileUploadInput.addEventListener('change', changeHandler);
    fileUpload.addEventListener('dragenter', dragenterHandler);
    fileUpload.addEventListener('dragover', dragoverHandler);
    fileUpload.addEventListener('dragleave', dragleaveHandler);
    fileUpload.addEventListener('dragend', dragendHandler);
    fileUpload.addEventListener('drop', dropHandler);

    // Store handlers for cleanup
    this.#fileUploadHandlers.set(fileUpload, {
      input: fileUploadInput,
      changeHandler,
      dragenterHandler,
      dragoverHandler,
      dragleaveHandler,
      dragendHandler,
      dropHandler
    });
  }

  // Cleanup method to remove all event listeners
  cleanup() {
    this._cleanupHandlers(this.#fileUploadHandlers, (fileUpload, handlers) => {
      handlers.input.removeEventListener('change', handlers.changeHandler);
      fileUpload.removeEventListener('dragenter', handlers.dragenterHandler);
      fileUpload.removeEventListener('dragover', handlers.dragoverHandler);
      fileUpload.removeEventListener('dragleave', handlers.dragleaveHandler);
      fileUpload.removeEventListener('dragend', handlers.dragendHandler);
      fileUpload.removeEventListener('drop', handlers.dropHandler);
    });
  }

  init() {
    this.#fileUploadList.forEach((fileUpload) => this.#handleFileUpload(fileUpload));
  }
}
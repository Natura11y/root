//////////////////////////////////////////////
// Form 
//////////////////////////////////////////////

export default class Form {
	#formList = document.querySelectorAll('form[novalidate]');
	#formEntryList = document.querySelectorAll('.form-entry');
	#fileUploadList = document.querySelectorAll('.file-upload');

	#formSubmitAttempted = false;

	#invalidClasses = ['is-invalid'];

	isEmpty(value = null) {
		return value === '';
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

	setInvalid(field) {
		let entryRoot = field.closest('.form-entry');
		entryRoot.classList.add(...this.#invalidClasses);
	}

	setValid(field) {
		let entryRoot = field.closest('.form-entry');
		entryRoot.classList.remove(...this.#invalidClasses);
	}

	createErrorMessage(desc, inst) {
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
			this.#formSubmitAttempted = true;

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
			let formErrorEntryLabel = formErrorEntry.querySelector(
				'.form-entry__field__label'
			);

			formErrorEntry.classList.add('is-invalid');

			const formEntryFeedback = formErrorEntry.querySelector(
				'.form-entry__feedback'
			);

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
					this.createErrorMessage(errorMessage, entryHelpText)
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

	handleFormInputs(formEntry) {
		const inputSelectors = ['email', 'input', 'select', 'tel', 'textarea'];

		const formEntryInputList = formEntry.querySelectorAll(inputSelectors);

		let isRequired = formEntry.hasAttribute('data-required');

		formEntryInputList.forEach((formEntryInput) =>
			this.processFormEntryInput(formEntryInput, isRequired)
		);
	}

	processFormEntryInput(formEntryInput, isRequired) {
		const isInputText = formEntryInput
			.closest('.form-entry')
			.querySelector('.form-entry__field__input');
		const inputTag = formEntryInput.tagName;

		let activeTarget = '.form-entry';

		if (inputTag === 'INPUT') {
			const inputType = formEntryInput.getAttribute('type');

			if (inputType === 'radio' || inputType === 'checkbox') {
				if (formEntryInput.disabled) {
					formEntryInput.closest('label').classList.add('disabled');
				}
			}
		}

		formEntryInput.addEventListener('focusin', this.focusIn(activeTarget));
		formEntryInput.addEventListener('focusout', this.focusOut(activeTarget));

		if (isRequired) {
			formEntryInput.setAttribute('required', 'true');
			formEntryInput.setAttribute('aria-required', true);
		}

		formEntryInput.addEventListener('change', () =>
			this.handleInputChange(formEntryInput, isRequired)
		);

		if (isInputText) {
			isInputText.addEventListener('click', this.handleClickOnInputText);
		}
	}

	focusIn(activeTarget) {
		return function () {
			this.closest(activeTarget).classList.add('active');
		};
	}

	focusOut(activeTarget) {
		return function () {
			this.closest(activeTarget).classList.remove('active');
		};
	}

	handleInputChange(formEntryInput, isRequired) {
		if (this.#formSubmitAttempted && isRequired) {
			this.checkIfEmpty(formEntryInput);
		}

		if (formEntryInput.value !== '') {
			formEntryInput.closest('.form-entry').classList.add('has-value');
		} else {
			formEntryInput.closest('.form-entry').classList.remove('has-value');
		}
	}

	handleClickOnInputText(event) {
		let clickTarget = event.target.tagName;
		let clickInput = event.target
			.closest('.form-entry__field__input')
			.querySelector('input');

		if (clickTarget === 'SPAN') {
			clickInput.focus();
		}

		if (clickTarget === 'BUTTON') {
			return;
		}
	}

	handleFileUpload(fileUpload) {
		const fileUploadInput = fileUpload.querySelector('input[type="file"]');

		fileUploadInput.addEventListener(
			'change',
			this.handleFileChange(fileUpload)
		);

		fileUpload.addEventListener('dragenter', this.dragOver);
		fileUpload.addEventListener('dragleave', this.dragOff);
		fileUpload.addEventListener('dragend', this.dragOff);
		fileUpload.addEventListener('drop', this.dropped);
	}

	handleFileChange(fileUpload) {
		return function (event) {
			const [file] = event.target.files;
			const { name: fileName, size } = file;
			const fileSize = (size / 1000).toFixed(2);

			const dataHTML = `
                <span class="file-upload__data">
                    <span class="file-name">${fileName}</span>
                    <span class="file-size">${fileSize} kb</span>
                </span>
            `;

			const fileUploadData = fileUpload.querySelector('.file-upload__data');

			if (fileUploadData) {
				fileUploadData.remove();
			}

			fileUpload.insertAdjacentHTML('beforeend', dataHTML);
		};
	}

	dragOver() {
		this.closest('.form-entry').classList.add('active');
	}

	dragOff() {
		this.closest('.form-entry').classList.remove('active');
	}

	dropped() {
		this.closest('.form-entry').classList.remove('active');
	}

	init() {

		this.#formList.forEach((form) => this.handleFormSubmission(form));
		this.#formEntryList.forEach((formEntry) =>
			this.handleFormInputs(formEntry)
		);

		this.#fileUploadList.forEach((fileUpload) =>
			this.handleFileUpload(fileUpload)
		);
	}
}
import React, { useState } from 'react';

import classNames from 'classnames';

const FormEntry = (props) => {

	const {
		labelText = 'Label',
		labelVisible = true,
		labelFloat = false,
		helpText = null,
		required = false,
		showError = false,
		entryType = 'text',
		entryId = null,
		entryName = null,
		onChangeHandler = null,
		ariaDescribedBy = null,
		utilities = null
	} = props;

	const [isFocused, setIsFocused] = useState(false);
	const [hasValue, setHasValue] = useState(false);

	const componentClasses = classNames(
		'form-entry',
		{
			'is-invalid': showError,
			'has-value': hasValue,
			'active': isFocused && entryType !== 'groupRadio' && entryType !== 'groupCheck',
			[`${utilities}`]: utilities !== null
		}
	);

	const floatClass = classNames({
		'form-entry__field--float': labelFloat,
	});

	const screenReaderOnly = classNames({
		'screen-reader-only': !labelVisible,
	});

	const formEntryFieldClass = classNames({
		'form-entry__field__input':
			entryType === 'email' ||
			entryType === 'password' ||
			entryType === 'search' ||
			entryType === 'text' ||
			entryType === 'tel' ||
			entryType === 'textarea' ||
			entryType === 'url' ||
			entryType === 'fileUpload',
		'form-entry__field__select': entryType === 'select',
		'form-entry__option':
			entryType === 'groupRadio' || 
			entryType === 'groupCheck' ||
			entryType === 'singleCheck' ||
			entryType === 'singleCheckSwitch',
	});

	let FieldTag = `label`; // default
	let LabelTag = `span`; // default

	if (entryType === 'groupRadio' || entryType === 'groupCheck') {
		FieldTag = `fieldset`;
		LabelTag = `legend`;
	}

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleBlur = (e) => {
		setIsFocused(false);
		if (e.target.value !== '') {
			setHasValue(true);
		} else {
			setHasValue(false);
		}
	};

	const entryField = () => {
		switch (entryType) {

			case 'email':
			case 'password':
			case 'search':
			case 'text':
			case 'tel':
			case 'url':

				return (
					<input
						type={entryType ? entryType : 'text'}
						name={entryName ? entryName : 'textInputId'}
						id={entryId ? entryId : 'text-input-id'}
						aria-describedby={ariaDescribedBy ? ariaDescribedBy : 'text-input-help-id'}
						onChange={onChangeHandler}
						onFocus={handleFocus}
						onBlur={handleBlur}
						required={required}
					/>
				);
				break;

			case 'textarea':
			
				return (
					<textarea
						rows='8'
						name={entryName ? entryName : 'textareaEntry'}
						id={entryId ? entryId : 'textarea-entry'}
						aria-describedby={ariaDescribedBy ? ariaDescribedBy : 'textarea-help-id'}
						onChange={onChangeHandler}
						onFocus={handleFocus}
						onBlur={handleBlur}
					></textarea>
				);
				break;

			case 'select':

				return (
					<select
						id='select-example'
						name='selectExample'
						aria-describedby='help-select-example'
						onFocus={handleFocus}
						onBlur={handleBlur}
					>
						<option>Select</option>
						<option value='Option One'>Option One</option>
						<option value='Option Two'>Option Two</option>
						<option value='Option Three'>Option Three</option>
						<option value='Option Four'>Option Four</option>
						<option value='Option Five'>Option Five</option>
					</select>
				);
				break;


			case 'groupRadio':

				const radioOptions = [
					'Option One',
					'Option Two',
					'Option Three',
					'Option Four',
				];

				const radios = radioOptions.map((radio, index) => (
					<div
						className={`form-entry__option__radio`}
						key={index}
					>
						<label>
							<input
								required={index === 0 && required}
								type='radio'
								name={entryName ? entryName : 'radioGroupExample'}
								id={`radio-option-${index}`}
								onFocus={handleFocus}
								onBlur={handleBlur}
								value={`option-${index}`}
								onChange={onChangeHandler}
							/>
							<span className='option__label'>{radio}</span>
						</label>
					</div>
				));

				return <>{radios}</>;

			case 'groupCheck':

				const checkOptions = [
					'Option One',
					'Option Two',
					'Option Three',
					'Option Four',
				];

				const checkboxes = checkOptions.map((check, index) => (
					<div className={`form-entry__option__check`} key={index}>
						<label>
							<input
								type='checkbox'
								name='checkboxGroupExample'
								id={`check-option-${index}`}
								value={`option-${index}`}
								onFocus={handleFocus}
								onBlur={handleBlur}
							/>
							<span className='option__label'>{check}</span>
						</label>
					</div>
				));

				return <>{checkboxes}</>;

			case 'singleCheck':

				return (
					<div className='form-entry__option__check'>
						<label>
							<input
								type='checkbox'
								name='singleOption'
								id='single-option'
								value='option'
								onFocus={handleFocus}
								onBlur={handleBlur}
							/>
							<span className='option__label'>Option</span>
						</label>
					</div>
				);

			case 'singleCheckSwitch':

				return (
					<div className='form-entry__option__check'>
						<div className='form-entry__option__switch'>
							<label>
								<input
									type='checkbox'
									name='singleOption'
									id='switch-option'
									value='option'
								/>
								<span className='switch__slider'></span>
								<span className='option__label'>Recieve Notifications</span>
							</label>
						</div>
					</div>
				);

			case 'fileUpload':

				return (
					<span className='file-upload'>

						<span className='file-upload__drop'>
							<span className='file-upload__drop__text'>Drag and Drop</span>
						</span>

						<input
							className='file-upload__input'
							type='file'
							name='fileUploadExample'
							id='file-uploadsple'
							accept='image/*'
						/>

						<span className='button button--outline button--has-icon file-upload__button'>
							<span className='icon icon-upload'></span>
							<span className='button__text'>Browse for a File</span>
						</span>

					</span>
				);

				break;

			default:
			// do nothing
		}
	};

	return (
		<div className={`${componentClasses}`} data-required={required}>
			<FieldTag className={`form-entry__field ${floatClass}`}>
				<LabelTag className={`form-entry__field__label ${screenReaderOnly}`}>
					{labelText}
				</LabelTag>

				{showError && (
					<small className='form-entry__feedback'>
						<span className='icon icon-warn' aria-hidden='true'></span>
						<span className='message'>
							<strong>Custom Error Message</strong> {helpText}
						</span>
					</small>
				)}

				<span className={`${formEntryFieldClass}`}>{entryField()}</span>
			</FieldTag>

			{helpText && (
				<small
					className='form-entry__help'
					id={`help-${entryId ? entryId : 'text-input-id'}`}
				>
					{helpText}
				</small>
			)}
		</div>
	);
};

export default FormEntry;
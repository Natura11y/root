import { Fragment, useState, useEffect, useRef } from 'react';

import RequiredIndicator from './RequiredIndicator';
import FormEntry from './FormEntry';
import Alert from '../alert';

const FormValidation = () => {

  const [formComplete, setFormComplete] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  const [enteredName, setEnteredName] = useState('');
  const [enteredNameIsValid, setEnteredNameIsValid] = useState(false);
  const [enteredNameTouched, setEnteredNameTouched] = useState(false);

  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredEmailIsValid, setEnteredEmailIsValid] = useState(false);
  const [enteredEmailTouched, setEnteredEmailTouched] = useState(false);

  const [enteredPhone, setEnteredPhone] = useState('');
  const [enteredPhoneIsValid, setEnteredPhoneIsValid] = useState(false);
  const [enteredPhoneTouched, setEnteredPhoneTouched] = useState(false);

  const [enteredMessage, setEnteredMessage] = useState('');
  const [enteredMessageIsValid, setEnteredMessageIsValid] = useState(false);
  const [enteredMessageTouched, setEnteredMessageTouched] = useState(false);

  const [enteredContactPreference, setEnteredContactPreference] = useState('');
  const [enteredContactPreferenceIsValid, setEnteredContactPreferenceIsValid] = useState(false);
  const [enteredContactPreferenceTouched, setEnteredContactPreferenceTouched] = useState(false);

  const nameIsInvalid = !enteredNameIsValid && enteredNameTouched;
  const emailIsInvalid = !enteredEmailIsValid && enteredEmailTouched;
  const phoneIsInvalid = !enteredPhoneIsValid && enteredPhoneTouched;
  const messageIsInvalid = !enteredMessageIsValid && enteredMessageTouched;

  const contactPreferenceIsInvalid = !enteredContactPreferenceIsValid && enteredContactPreferenceTouched;

  const formRef = useRef();

  useEffect(() => {

    const element = formRef.current.querySelector('.is-invalid');

    if (element) {
			element.scrollIntoView({ block: 'start', behavior: 'smooth' });
			element.querySelector('input').focus();
		}
  
  }, [formErrors]);

  const nameChangeHandler = (event) => {
    setEnteredName(event.target.value); 
    setEnteredNameTouched(true);

    if (event.target.value !== '') {
			setEnteredNameIsValid(true);
		} else {
			setEnteredNameIsValid(false);
		}
  }

  const emailChangeHandler = (event) => {
    setEnteredEmail(event.target.value); 
    setEnteredEmailTouched(true);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (event.target.value !== '' && emailRegex.test(event.target.value)) {
			setEnteredEmailIsValid(true);
		} else {
			setEnteredEmailIsValid(false);
		}
  }

  const phoneChangeHandler = (event) => {
    setEnteredPhone(event.target.value); 
    setEnteredPhoneTouched(true);

    // Basic phone validation (allows various formats)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$|^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
    if (event.target.value !== '' && phoneRegex.test(event.target.value.replace(/\s/g, ''))) {
			setEnteredPhoneIsValid(true);
		} else {
			setEnteredPhoneIsValid(false);
		}
  }

  const messageChangeHandler = (event) => {
    setEnteredMessage(event.target.value); 
    setEnteredMessageTouched(true);

    if (event.target.value !== '') {
			setEnteredMessageIsValid(true);
		} else {
			setEnteredMessageIsValid(false);
		}
  }

  const contactPreferenceChangeHandler = (event) => {
    setEnteredContactPreference(event.target.value); 
    setEnteredContactPreferenceTouched(true);

    if (event.target.value !== '') {
			setEnteredContactPreferenceIsValid(true);
		} else {
			setEnteredContactPreferenceIsValid(false);
		}
  }

  const formSubmitHandler = (event) => {

    event.preventDefault();

    setEnteredNameTouched(true);
    setEnteredEmailTouched(true);
    setEnteredPhoneTouched(true);
    setEnteredMessageTouched(true);
    setEnteredContactPreferenceTouched(true);

    if (enteredName.trim() === '') {
			setEnteredNameIsValid(false);
			setFormErrors((current) => [...current, 'Name']);
			return;
		}

		setEnteredNameIsValid(true);

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (enteredEmail.trim() === '' || !emailRegex.test(enteredEmail)) {
			setEnteredEmailIsValid(false);
			setFormErrors((current) => [...current, 'Email']);
			return;
		}

		setEnteredEmailIsValid(true);

		const phoneRegex = /^[\+]?[1-9][\d]{0,15}$|^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
		if (enteredPhone.trim() === '' || !phoneRegex.test(enteredPhone.replace(/\s/g, ''))) {
			setEnteredPhoneIsValid(false);
			setFormErrors((current) => [...current, 'Phone']);
			return;
		}

		setEnteredPhoneIsValid(true);

		if (!enteredMessage.length) {
			setEnteredMessageIsValid(false);
			return;
		}

		setEnteredMessageIsValid(true);

		if (enteredContactPreference === '') {
			setEnteredContactPreferenceIsValid(false);
			return;
		}

		setEnteredContactPreferenceIsValid(true);

    setFormComplete(true);

  }
  
  return (
		<Fragment>
			{!formComplete ? (

				<form
					onSubmit={formSubmitHandler}
					autoComplete='off'
					ref={formRef}
					noValidate>
				
					<RequiredIndicator />

					<FormEntry
						labelText='Name'
						required={true}
						helpText='Enter your first and last name'
						entryId='name'
						entryName='name'
						inputValue={enteredName}
						onChangeHandler={nameChangeHandler}
						showError={nameIsInvalid ? true : false}
					/>

					<FormEntry
						labelText='Email'
						required={true}
						helpText='Example: janeDoe@email.com'
						entryType='email'
						entryId='email'
						entryName='email'
						inputValue={enteredEmail}
						onChangeHandler={emailChangeHandler}
						showError={emailIsInvalid ? true : false}
					/>

					<FormEntry
						labelText='Phone'
						required={true}
						helpText='Enter a valid phone number'
						entryType='tel'
						entryId='phone'
						entryName='phone'
						inputValue={enteredPhone}
						onChangeHandler={phoneChangeHandler}
						showError={phoneIsInvalid ? true : false}
					/>

					<FormEntry
						labelText='Leave a short message'
						required={true}
						entryType='textarea'
						entryId='message'
						entryName='message'
						onChangeHandler={messageChangeHandler}
						showError={messageIsInvalid ? true : false}
					/>

					<FormEntry
						labelText='Contact Preference'
						entryType='groupRadio'
						required={true}
						entryId='contact-preference'
						entryName='contactPreference'
						onChangeHandler={contactPreferenceChangeHandler}
						showError={contactPreferenceIsInvalid ? true : false}
					/>

					<button className='button theme-primary width-100 border-radius-pill margin-y-4'>
						Send
					</button>

				</form>
			) : (
			<Alert title='Thank you for your input'>
          		<p>Your information has been sent.</p>
        	</Alert>
			)}
		</Fragment>
	);
}

export default FormValidation;
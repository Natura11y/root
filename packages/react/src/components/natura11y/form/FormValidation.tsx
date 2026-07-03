import { Fragment, useState, useEffect, useRef } from 'react';
import RequiredIndicator from './RequiredIndicator';
import FormEntry from './FormEntry';
import Alert from '../alert';

const FormValidation = () => {
  const [formComplete, setFormComplete] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

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

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const element = formRef.current?.querySelector('.is-invalid');
    if (element) {
      element.scrollIntoView({ block: 'start', behavior: 'smooth' });
      (element.querySelector('input') as HTMLInputElement | null)?.focus();
    }
  }, [formErrors]);

  const nameChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEnteredName(event.target.value);
    setEnteredNameTouched(true);
    setEnteredNameIsValid(event.target.value !== '');
  };

  const emailChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEnteredEmail(event.target.value);
    setEnteredEmailTouched(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEnteredEmailIsValid(event.target.value !== '' && emailRegex.test(event.target.value));
  };

  const phoneChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEnteredPhone(event.target.value);
    setEnteredPhoneTouched(true);
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$|^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
    setEnteredPhoneIsValid(event.target.value !== '' && phoneRegex.test(event.target.value.replace(/\s/g, '')));
  };

  const messageChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEnteredMessage(event.target.value);
    setEnteredMessageTouched(true);
    setEnteredMessageIsValid(event.target.value !== '');
  };

  const contactPreferenceChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEnteredContactPreference(event.target.value);
    setEnteredContactPreferenceTouched(true);
    setEnteredContactPreferenceIsValid(event.target.value !== '');
  };

  const formSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
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
  };

  return (
    <Fragment>
      {!formComplete ? (
        <form onSubmit={formSubmitHandler} autoComplete='off' ref={formRef} noValidate>
          <RequiredIndicator />

          <FormEntry
            labelText='Name'
            required={true}
            helpText='Enter your first and last name'
            entryId='name'
            entryName='name'
            onChange={nameChangeHandler}
            showError={nameIsInvalid}
          />

          <FormEntry
            labelText='Email'
            required={true}
            helpText='Example: janeDoe@email.com'
            entryType='email'
            entryId='email'
            entryName='email'
            onChange={emailChangeHandler}
            showError={emailIsInvalid}
          />

          <FormEntry
            labelText='Phone'
            required={true}
            helpText='Enter a valid phone number'
            entryType='tel'
            entryId='phone'
            entryName='phone'
            onChange={phoneChangeHandler}
            showError={phoneIsInvalid}
          />

          <FormEntry
            labelText='Leave a short message'
            required={true}
            entryType='textarea'
            entryId='message'
            entryName='message'
            onChange={messageChangeHandler}
            showError={messageIsInvalid}
          />

          <FormEntry
            labelText='Contact Preference'
            entryType='groupRadio'
            required={true}
            entryId='contact-preference'
            entryName='contactPreference'
            onChange={contactPreferenceChangeHandler}
            showError={contactPreferenceIsInvalid}
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
};

export default FormValidation;
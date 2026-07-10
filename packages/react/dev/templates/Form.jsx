import { useState } from 'react';
import {
  Alert,
  Button,
  Form,
  FormEntry,
  RequiredIndicator,
} from '@lib/components';
import { PageBreadcrumb } from '../components/PageBanner';
import {
  contactMethodOptions,
  initialContactForm,
  subjectOptions,
  topicOptions,
  validateContactForm,
} from '../data';

const ContactForm = () => {
  const [formData, setFormData] = useState(initialContactForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const clearError = (field) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleFieldChange = (field) => (event) => {
    const target = event.target;
    const nextValue = target.type === 'checkbox' ? target.checked : target.value;
    setFormData((current) => ({ ...current, [field]: nextValue }));
    setSubmitted(false);
    clearError(field);
  };

  const handleTopicsChange = (event) => {
    const { checked, value } = event.target;
    setFormData((current) => {
      const topics = checked
        ? [...current.topics, value]
        : current.topics.filter((item) => item !== value);

      return { ...current, topics };
    });
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateContactForm(formData);
    setErrors(nextErrors);
    setSubmitted(Object.keys(nextErrors).length === 0);
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <RequiredIndicator text="Required fields are marked with" />

      {submitted && (
        <Alert title="Message ready" utilities="margin-bottom-3">
          <p>
            Thanks, {formData.firstName}. This demo submission shows the React contact form pattern is working end to end.
          </p>
        </Alert>
      )}

      {Object.keys(errors).length > 0 && (
        <Alert success={false} title="Review the form" utilities="margin-bottom-3">
          <p>A few required details need attention before this can be submitted.</p>
        </Alert>
      )}

      <FormEntry
        labelText="First Name"
        required
        entryId="first-name"
        entryName="firstName"
        value={formData.firstName}
        onChange={handleFieldChange('firstName')}
        showError={Boolean(errors.firstName)}
        errorTitle="Required"
        errorMessage={errors.firstName}
      />

      <FormEntry
        labelText="Last Name"
        required
        entryId="last-name"
        entryName="lastName"
        value={formData.lastName}
        onChange={handleFieldChange('lastName')}
        showError={Boolean(errors.lastName)}
        errorTitle="Required"
        errorMessage={errors.lastName}
      />

      <FormEntry
        labelText="Email Address"
        required
        entryType="email"
        entryId="email"
        entryName="email"
        value={formData.email}
        onChange={handleFieldChange('email')}
        helpText="We'll never share your email address."
        showError={Boolean(errors.email)}
        errorTitle="Invalid email"
        errorMessage={errors.email}
      />

      <FormEntry
        labelText="Phone Number"
        entryType="tel"
        entryId="phone"
        entryName="phone"
        value={formData.phone}
        onChange={handleFieldChange('phone')}
      />

      <FormEntry
        labelText="Subject"
        required
        entryType="select"
        entryId="subject"
        entryName="subject"
        value={formData.subject}
        options={subjectOptions}
        emptyOptionLabel="Select a subject"
        onChange={handleFieldChange('subject')}
        showError={Boolean(errors.subject)}
        errorTitle="Required"
        errorMessage={errors.subject}
      />

      <FormEntry
        labelText="Message"
        required
        entryType="textarea"
        entryId="message"
        entryName="message"
        value={formData.message}
        rows={8}
        onChange={handleFieldChange('message')}
        helpText="Please be as specific as possible."
        showError={Boolean(errors.message)}
        errorTitle="Required"
        errorMessage={errors.message}
      />

      <FormEntry
        labelText="Preferred Contact Method"
        entryType="groupRadio"
        entryId="contact-method"
        entryName="contactMethod"
        value={formData.contactMethod}
        options={contactMethodOptions}
        onChange={handleFieldChange('contactMethod')}
      />

      <FormEntry
        labelText="Topics of Interest"
        entryType="groupCheck"
        entryId="topics"
        entryName="topics"
        options={topicOptions}
        onChange={handleTopicsChange}
      />

      <FormEntry
        labelText="Newsletter"
        labelVisible={false}
        entryType="singleCheckSwitch"
        entryId="newsletter"
        entryName="newsletter"
        value={formData.newsletter ? 'true' : 'false'}
        optionLabel="Subscribe to our newsletter"
        onChange={handleFieldChange('newsletter')}
      />

      <div className="margin-top-4">
        <Button
          buttonType="submit"
          title="Send Message"
          utilities="theme-dark"
          iconEndHandle="send"
        />
      </div>
    </Form>
  );
};

const FormTemplate = () => (
  <main id="main-content">
    <header className="theme-light">
      <PageBreadcrumb />

      <div className="container wide padding-y-5">
        <h1 className="banner-headline">Contact Us</h1>
      </div>
    </header>

    <div className="container wide--lg margin-y-6">
      <div className="grid-sidebar--right gap-5">
        <article className="grid-sidebar__major">
          <div className="medium--lg">
            <h2 className="h1 margin-bottom-2">Send Us a Message</h2>
            <p className="font-size-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula feugiat erat, vitae placerat turpis facilisis vel. Donec fringilla orci at libero tristique.
            </p>

            <div className="narrow--lg">
              <ContactForm />
            </div>
          </div>
        </article>

        <aside className="grid-sidebar__minor" aria-label="Contact Information">
          <div className="narrow--lg margin-x-auto">
            <div className="grid gap-4">
              <div>
                <h2 className="h6">Example Organization</h2>

                <address className="margin-bottom-2 font-size-md">
                  <p>
                    <strong>Main office</strong><br />
                    123 Springwater Rd<br />
                    Anytown, ST 00000
                  </p>
                </address>

                <Button
                  tag="a"
                  linkUrl="tel:+12025550100"
                  title="(202) 555-0100"
                  iconStartHandle="call"
                  utilities="text-color-link font-size-md"
                />
              </div>

              <div>
                <h3 className="h6">Office Hours:</h3>

                <dl className="font-size-md grid grid--divider gap-1">
                  <div className="flex-row gap-2 justify-content-between">
                    <dt>Monday - Friday</dt>
                    <dd>9am - 5pm</dd>
                  </div>
                  <div className="flex-row gap-2 justify-content-between">
                    <dt>Saturday</dt>
                    <dd>10am - 2pm</dd>
                  </div>
                  <div className="flex-row gap-2 justify-content-between">
                    <dt>Sunday</dt>
                    <dd>Closed</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </main>
);

export default FormTemplate;

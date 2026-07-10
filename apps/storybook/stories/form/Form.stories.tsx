import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaFormInput from '@core-js/form';
import FormEntry from '@lib/components/form/FormEntry';
import FormEntrySearch from '@lib/components/form/FormEntrySearch';
import FormValidation from '@lib/components/form/FormValidation';
import RequiredIndicator from '@lib/components/form/RequiredIndicator';
import VanillaExample from '../../utils/VanillaExample';
import formMarkup from './form.example.html?raw';

const initializeForm = () => {
  new VanillaFormInput().init();
};

const emailInputMarkup = `<div class="form-entry" data-required="true">
  <label class="form-entry__field">
    <span class="form-entry__field__label">
      Email address
    </span>

    <span class="form-entry__field__input">
      <input
        type="email"
        id="email-input-html"
        name="email"
        aria-describedby="help-email-input-html"
        required
      />
    </span>
  </label>

  <small class="form-entry__help" id="help-email-input-html">
    Example: jane.doe@email.com
  </small>
</div>`;

const passwordInputMarkup = `<div class="form-entry" data-required="true">
  <label class="form-entry__field">
    <span class="form-entry__field__label">
      Password
    </span>

    <span class="form-entry__field__input">
      <input
        type="password"
        id="password-input-html"
        name="password"
        aria-describedby="help-password-input-html"
        required
      />
    </span>
  </label>

  <small class="form-entry__help" id="help-password-input-html">
    Must be at least 8 characters.
  </small>
</div>`;

const searchEntryMarkup = `<form>
  <div class="form-entry form-entry--search">
    <label class="form-entry__field">
      <span class="form-entry__field__label screen-reader-only">
        Search
      </span>

      <span class="form-entry__field__input">
        <span class="icon icon-search opacity-50" aria-hidden="true"></span>
        <input
          type="search"
          id="search-entry-html"
          name="searchEntry"
        />

        <button
          type="button"
          class="button button--icon-only"
          data-search-clear
          aria-label="Clear search"
          aria-controls="search-entry-html"
        >
          <span class="icon icon-clear" aria-hidden="true"></span>
        </button>

        <button type="submit" class="button theme-primary">
          Search
        </button>
      </span>
    </label>
  </div>
</form>`;

const selectMarkup = `<div class="form-entry">
  <label class="form-entry__field">
    <span class="form-entry__field__label">
      Country
    </span>

    <span class="form-entry__field__select">
      <select
        id="select-html"
        name="country"
        aria-describedby="help-select-html"
      >
        <option value="">Select</option>
        <option value="option-1">Option One</option>
        <option value="option-2">Option Two</option>
        <option value="option-3">Option Three</option>
      </select>
    </span>
  </label>

  <small class="form-entry__help" id="help-select-html">
    Choose an option from the list.
  </small>
</div>`;

const textareaMarkup = `<div class="form-entry">
  <label class="form-entry__field">
    <span class="form-entry__field__label">
      Message
    </span>

    <span class="form-entry__field__input">
      <textarea
        rows="8"
        name="message"
        id="textarea-html"
        aria-describedby="help-textarea-html"
      ></textarea>
    </span>
  </label>

  <small class="form-entry__help" id="help-textarea-html">
    Leave a short message.
  </small>
</div>`;

const fileUploadMarkup = `<div class="form-entry">
  <div class="form-entry__field">
    <span class="form-entry__field__label">
      Upload a single file
    </span>

    <div class="form-entry__field__input">
      <label class="file-upload">
        <span class="file-upload__drop">
          <span class="file-upload__drop__text">Drag and Drop</span>
        </span>

        <input
          class="file-upload__input"
          type="file"
          name="fileUpload"
          id="file-upload-html"
          accept="image/*"
        />

        <span class="button button--outline file-upload__button">
          <span class="icon icon-upload" aria-hidden="true"></span>
          <span class="text">Browse for a File</span>
        </span>
      </label>
    </div>
  </div>

  <small class="form-entry__help" id="help-file-upload-html">
    Accepted file type: image.
  </small>
</div>`;

const checkboxGroupMarkup = `<div class="form-entry">
  <fieldset class="form-entry__field">
    <legend class="form-entry__field__label">
      Select all that apply
    </legend>

    <div class="form-entry__option">
      <div class="form-entry__option__check">
        <label>
          <input
            type="checkbox"
            name="checkboxGroup"
            id="checkbox-group-html-option-one"
            value="option-1"
          />
          <span class="option__label">Option One</span>
        </label>
      </div>

      <div class="form-entry__option__check">
        <label>
          <input
            type="checkbox"
            name="checkboxGroup"
            id="checkbox-group-html-option-two"
            value="option-2"
          />
          <span class="option__label">Option Two</span>
        </label>
      </div>

      <div class="form-entry__option__check">
        <label>
          <input
            type="checkbox"
            name="checkboxGroup"
            id="checkbox-group-html-option-three"
            value="option-3"
          />
          <span class="option__label">Option Three</span>
        </label>
      </div>
    </div>
  </fieldset>
</div>`;

const singleCheckboxMarkup = `<div class="form-entry">
  <div class="form-entry__field">
    <span class="form-entry__field__label" id="single-checkbox-html-label">
      Agreement
    </span>

    <div class="form-entry__option">
      <div class="form-entry__option__check">
        <label aria-labelledby="single-checkbox-html-label">
          <input
            type="checkbox"
            name="agreement"
            id="single-checkbox-html"
            value="true"
          />
          <span class="option__label">Option</span>
        </label>
      </div>
    </div>
  </div>
</div>`;

const checkboxSwitchMarkup = `<div class="form-entry">
  <div class="form-entry__field">
    <span class="form-entry__field__label" id="checkbox-switch-html-label">
      Notifications
    </span>

    <div class="form-entry__option">
      <div class="form-entry__option__switch">
        <label aria-labelledby="checkbox-switch-html-label">
          <input
            type="checkbox"
            name="notifications"
            id="checkbox-switch-html"
            value="true"
          />
          <span class="switch__slider"></span>
          <span class="option__label">Option</span>
        </label>
      </div>
    </div>
  </div>
</div>`;

const radioGroupMarkup = `<div class="form-entry" data-required="true">
  <fieldset class="form-entry__field">
    <legend class="form-entry__field__label">
      Contact preference
    </legend>

    <div class="form-entry__option">
      <div class="form-entry__option__radio">
        <label>
          <input
            type="radio"
            name="contactPreference"
            id="radio-group-html-option-one"
            value="option-1"
            required
          />
          <span class="option__label">Option One</span>
        </label>
      </div>

      <div class="form-entry__option__radio">
        <label>
          <input
            type="radio"
            name="contactPreference"
            id="radio-group-html-option-two"
            value="option-2"
          />
          <span class="option__label">Option Two</span>
        </label>
      </div>

      <div class="form-entry__option__radio">
        <label>
          <input
            type="radio"
            name="contactPreference"
            id="radio-group-html-option-three"
            value="option-3"
          />
          <span class="option__label">Option Three</span>
        </label>
      </div>
    </div>
  </fieldset>
</div>`;

const requiredFieldMarkup = `<p class="required-indicator" aria-hidden="true">
  <span class="required-indicator__text">Required fields indicated with</span>
  <span class="icon icon-asterisk" aria-hidden="true"></span>
</p>

<div class="form-entry" data-required="true">
  <label class="form-entry__field">
    <span class="form-entry__field__label">
      Name
    </span>

    <span class="form-entry__field__input">
      <input
        type="text"
        id="required-field-html"
        name="name"
        aria-describedby="help-required-field-html"
        required
      />
    </span>
  </label>

  <small class="form-entry__help" id="help-required-field-html">
    Enter your first and last name.
  </small>
</div>`;

const errorStateMarkup = `<div class="form-entry is-invalid" data-required="true">
  <label class="form-entry__field">
    <span class="form-entry__field__label">
      Email address
    </span>

    <small class="form-entry__feedback" id="feedback-error-state-html">
      <span class="icon icon-warn" aria-hidden="true"></span>
      <span class="message">
        <strong>Error</strong> Please enter a valid email address.
      </span>
    </small>

    <span class="form-entry__field__input">
      <input
        type="email"
        id="error-state-html"
        name="emailError"
        aria-describedby="help-error-state-html feedback-error-state-html"
        required
      />
    </span>
  </label>

  <small class="form-entry__help" id="help-error-state-html">
    Please enter a valid email address.
  </small>
</div>`;

const floatingLabelMarkup = `<div class="form-entry" data-required="true">
  <label class="form-entry__field form-entry__field--float">
    <span class="form-entry__field__label">
      Username
    </span>

    <span class="form-entry__field__input">
      <input
        type="text"
        id="floating-label-html"
        name="username"
        required
      />
    </span>
  </label>
</div>`;

const validationMarkup = `<form data-validate novalidate>
  <div
    class="form-entry"
    data-required="true"
    data-error-message="Username is required"
  >
    <label class="form-entry__field form-entry__field--float">
      <span class="form-entry__field__label">
        Username
      </span>

      <span class="form-entry__field__input">
        <input
          type="text"
          id="account-username-html"
          name="accountUsername"
        />
      </span>
    </label>
  </div>

  <button class="button theme-primary width-100 border-radius-pill margin-y-4">
    Send
  </button>
</form>`;

const meta = {
  title: 'Form',
  component: FormEntry,
  argTypes: {
    entryType: {
      control: 'select',
      options: [
        'text',
        'email',
        'password',
        'search',
        'tel',
        'url',
        'textarea',
        'select',
        'groupRadio',
        'groupCheck',
        'singleCheck',
        'singleCheckSwitch',
        'fileUpload',
      ],
    },
    labelFloat: { control: 'boolean' },
    required: { control: 'boolean' },
    showError: { control: 'boolean' },
  },
  parameters: {
    docs: {
      codePanel: true,
    },
  },
} satisfies Meta<typeof FormEntry>;

export default meta;
type Story = StoryObj<typeof meta>;

const sourceParameters = (markup: string) => ({
  docs: {
    source: {
      code: markup.trim(),
      language: 'html',
      type: 'code',
    },
  },
});

const htmlStory = (name: string, markup: string): Story => ({
  name,
  parameters: sourceParameters(markup),
  render: () => (
    <VanillaExample html={markup} initialize={initializeForm} />
  ),
});

export const HTML: Story = {
  name: 'Default (HTML)',
  parameters: sourceParameters(formMarkup),
  render: () => (
    <VanillaExample html={formMarkup} initialize={initializeForm} />
  ),
};

export const React: Story = {
  name: 'Default (React)',
  args: {
    labelText: 'Full name',
    helpText: 'Enter your first and last name.',
    entryType: 'text',
    entryId: 'text-input-story',
    entryName: 'fullName',
  },
};

export const EmailInputHtml: Story = htmlStory('Email Input (HTML)', emailInputMarkup);

export const EmailInput: Story = {
  name: 'Email Input (React)',
  args: {
    labelText: 'Email address',
    helpText: 'Example: jane.doe@email.com',
    entryType: 'email',
    entryId: 'email-input-story',
    entryName: 'email',
    required: true,
  },
};

export const PasswordInputHtml: Story = htmlStory('Password Input (HTML)', passwordInputMarkup);

export const PasswordInput: Story = {
  name: 'Password Input (React)',
  args: {
    labelText: 'Password',
    helpText: 'Must be at least 8 characters.',
    entryType: 'password',
    entryId: 'password-input-story',
    entryName: 'password',
    required: true,
  },
};

export const SearchEntryHtml: Story = htmlStory('Search Entry (HTML)', searchEntryMarkup);

export const SearchEntry: Story = {
  name: 'Search Entry (React)',
  render: () => (
    <FormEntrySearch
      id='search-entry-story'
      name='searchEntry'
      submitButton='text'
    />
  ),
};

export const SelectHtml: Story = htmlStory('Select (HTML)', selectMarkup);

export const Select: Story = {
  name: 'Select (React)',
  args: {
    labelText: 'Country',
    helpText: 'Choose an option from the list.',
    entryType: 'select',
    entryId: 'select-story',
    entryName: 'country',
  },
};

export const TextareaHtml: Story = htmlStory('Text Area (HTML)', textareaMarkup);

export const Textarea: Story = {
  name: 'Text Area (React)',
  args: {
    labelText: 'Message',
    helpText: 'Leave a short message.',
    entryType: 'textarea',
    entryId: 'textarea-story',
    entryName: 'message',
  },
};

export const FileUploadHtml: Story = htmlStory('File Upload (HTML)', fileUploadMarkup);

export const FileUpload: Story = {
  name: 'File Upload (React)',
  args: {
    labelText: 'Upload a single file',
    helpText: 'Accepted file type: image.',
    entryType: 'fileUpload',
    entryId: 'file-upload-story',
    entryName: 'fileUpload',
  },
};

export const CheckboxGroupHtml: Story = htmlStory('Checkbox Group (HTML)', checkboxGroupMarkup);

export const CheckboxGroup: Story = {
  name: 'Checkbox Group (React)',
  args: {
    labelText: 'Select all that apply',
    entryType: 'groupCheck',
    entryId: 'checkbox-group-story',
    entryName: 'checkboxGroup',
  },
};

export const SingleCheckboxHtml: Story = htmlStory('Single Checkbox (HTML)', singleCheckboxMarkup);

export const SingleCheckbox: Story = {
  name: 'Single Checkbox (React)',
  args: {
    labelText: 'Agreement',
    entryType: 'singleCheck',
    entryId: 'single-checkbox-story',
    entryName: 'agreement',
  },
};

export const CheckboxSwitchHtml: Story = htmlStory('Checkbox Switch (HTML)', checkboxSwitchMarkup);

export const CheckboxSwitch: Story = {
  name: 'Checkbox Switch (React)',
  args: {
    labelText: 'Notifications',
    entryType: 'singleCheckSwitch',
    entryId: 'checkbox-switch-story',
    entryName: 'notifications',
  },
};

export const RadioGroupHtml: Story = htmlStory('Radio Group (HTML)', radioGroupMarkup);

export const RadioGroup: Story = {
  name: 'Radio Group (React)',
  args: {
    labelText: 'Contact preference',
    entryType: 'groupRadio',
    entryId: 'radio-group-story',
    entryName: 'contactPreference',
    required: true,
  },
};

export const RequiredFieldHtml: Story = htmlStory('Required Field (HTML)', requiredFieldMarkup);

export const RequiredField: Story = {
  name: 'Required Field (React)',
  render: () => (
    <>
      <RequiredIndicator />
      <FormEntry
        labelText='Name'
        helpText='Enter your first and last name.'
        entryId='required-field-story'
        entryName='name'
        required
      />
    </>
  ),
};

export const ErrorStateHtml: Story = htmlStory('Error State (HTML)', errorStateMarkup);

export const ErrorState: Story = {
  name: 'Error State (React)',
  args: {
    labelText: 'Email address',
    helpText: 'Please enter a valid email address.',
    entryType: 'email',
    entryId: 'error-state-story',
    entryName: 'emailError',
    required: true,
    showError: true,
  },
};

export const FloatingLabelHtml: Story = htmlStory('Floating Label (HTML)', floatingLabelMarkup);

export const FloatingLabel: Story = {
  name: 'Floating Label (React)',
  args: {
    labelText: 'Username',
    entryType: 'text',
    entryId: 'floating-label-story',
    entryName: 'username',
    labelFloat: true,
    required: true,
  },
};

export const ValidationExampleHtml: Story = htmlStory('Validation Example (HTML)', validationMarkup);

export const ValidationExample: Story = {
  name: 'Validation Example (React)',
  render: () => <FormValidation />,
};

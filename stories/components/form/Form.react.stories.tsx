import type { Meta, StoryObj } from '@storybook/react-vite';
import FormEntry from '@lib/components/natura11y/form/FormEntry';
import FormEntrySearch from '@lib/components/natura11y/form/FormEntrySearch';
import FormValidation from '@lib/components/natura11y/form/FormValidation';
import RequiredIndicator from '@lib/components/natura11y/form/RequiredIndicator';

const meta = {
  title: 'Form',
  component: FormEntry,
  tags: ['autodocs'],
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
} satisfies Meta<typeof FormEntry>;

export default meta;
type Story = StoryObj<typeof meta>;

export const React: Story = {
  args: {
    labelText: 'Full name',
    helpText: 'Enter your first and last name.',
    entryType: 'text',
    entryId: 'text-input-story',
    entryName: 'fullName',
  },
};

export const EmailInput: Story = {
  name: 'Email Input',
  args: {
    labelText: 'Email address',
    helpText: 'Example: jane.doe@email.com',
    entryType: 'email',
    entryId: 'email-input-story',
    entryName: 'email',
    required: true,
  },
};

export const PasswordInput: Story = {
  name: 'Password Input',
  args: {
    labelText: 'Password',
    helpText: 'Must be at least 8 characters.',
    entryType: 'password',
    entryId: 'password-input-story',
    entryName: 'password',
    required: true,
  },
};

export const SearchInput: Story = {
  name: 'Search Input',
  args: {
    labelText: 'Search',
    entryType: 'search',
    entryId: 'search-input-story',
    entryName: 'search',
    buttonLabel: 'Search',
  },
};

export const SearchEntry: Story = {
  name: 'Search Entry',
  render: () => (
    <FormEntrySearch
      id='search-entry-story'
      name='searchEntry'
      submitButton='text'
    />
  ),
};

export const Select: Story = {
  args: {
    labelText: 'Country',
    helpText: 'Choose an option from the list.',
    entryType: 'select',
    entryId: 'select-story',
    entryName: 'country',
  },
};

export const Textarea: Story = {
  name: 'Text Area',
  args: {
    labelText: 'Message',
    helpText: 'Leave a short message.',
    entryType: 'textarea',
    entryId: 'textarea-story',
    entryName: 'message',
  },
};

export const FileUpload: Story = {
  name: 'File Upload',
  args: {
    labelText: 'Upload a single file',
    helpText: 'Accepted file type: image.',
    entryType: 'fileUpload',
    entryId: 'file-upload-story',
    entryName: 'fileUpload',
  },
};

export const CheckboxGroup: Story = {
  name: 'Checkbox Group',
  args: {
    labelText: 'Select all that apply',
    entryType: 'groupCheck',
    entryId: 'checkbox-group-story',
    entryName: 'checkboxGroup',
  },
};

export const SingleCheckbox: Story = {
  name: 'Single Checkbox',
  args: {
    labelText: 'Agreement',
    entryType: 'singleCheck',
    entryId: 'single-checkbox-story',
    entryName: 'agreement',
  },
};

export const CheckboxSwitch: Story = {
  name: 'Checkbox Switch',
  args: {
    labelText: 'Notifications',
    entryType: 'singleCheckSwitch',
    entryId: 'checkbox-switch-story',
    entryName: 'notifications',
  },
};

export const RadioGroup: Story = {
  name: 'Radio Group',
  args: {
    labelText: 'Contact preference',
    entryType: 'groupRadio',
    entryId: 'radio-group-story',
    entryName: 'contactPreference',
    required: true,
  },
};

export const RequiredField: Story = {
  name: 'Required Field',
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

export const ErrorState: Story = {
  name: 'Error State',
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

export const FloatingLabel: Story = {
  name: 'Floating Label',
  args: {
    labelText: 'Username',
    entryType: 'text',
    entryId: 'floating-label-story',
    entryName: 'username',
    labelFloat: true,
    required: true,
  },
};

export const ValidationExample: Story = {
  name: 'Validation Example',
  render: () => <FormValidation />,
};

import { useState, useId, type Ref, type ReactNode, type ChangeEvent, type FocusEvent, type ElementType } from 'react';
import classNames from 'classnames';

type EntryType =
  | 'text' | 'email' | 'password' | 'search' | 'tel' | 'url'
  | 'textarea' | 'select'
  | 'groupRadio' | 'groupCheck' | 'singleCheck' | 'singleCheckSwitch'
  | 'fileUpload';

type ChangeHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;

interface FormOption {
  label: string;
  value: string;
}

interface FormEntryProps {
  ref?: Ref<HTMLDivElement>;
  labelText?: string;
  labelVisible?: boolean;
  labelFloat?: boolean;
  helpText?: string | null;
  required?: boolean;
  showError?: boolean;
  errorTitle?: string;
  errorMessage?: ReactNode;
  entryType?: EntryType;
  entryId?: string | null;
  entryName?: string | null;
  value?: string;
  defaultValue?: string;
  placeholder?: string | null;
  rows?: number;
  options?: FormOption[];
  emptyOptionLabel?: string;
  optionLabel?: string;
  onChange?: ChangeHandler | null;
  ariaDescribedBy?: string | null;
  buttonLabel?: string | null;
  fileAccept?: string;
  fileDropText?: string;
  fileButtonText?: string;
  utilities?: string | null;
}

const FormEntry = ({
  ref,
  labelText = 'Label',
  labelVisible = true,
  labelFloat = false,
  helpText = null,
  required = false,
  showError = false,
  errorTitle = 'Error',
  errorMessage = null,
  entryType = 'text',
  entryId = null,
  entryName = null,
  value,
  defaultValue,
  placeholder = null,
  rows = 8,
  options = [],
  emptyOptionLabel = 'Select',
  optionLabel = 'Option',
  onChange = null,
  ariaDescribedBy = null,
  buttonLabel = null,
  fileAccept = 'image/*',
  fileDropText = 'Drag and Drop',
  fileButtonText = 'Browse for a File',
  utilities = null,
}: FormEntryProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const generatedId = useId();
  const resolvedId = entryId ?? generatedId;
  const helpId = ariaDescribedBy ?? `help-${resolvedId}`;
  const feedbackId = `feedback-${resolvedId}`;
  const describedBy = [
    helpText ? helpId : null,
    showError ? feedbackId : null,
  ].filter(Boolean).join(' ') || undefined;

  const isGroup = entryType === 'groupRadio' || entryType === 'groupCheck';
  const isOption = entryType === 'singleCheck' || entryType === 'singleCheckSwitch';
  const isFileUpload = entryType === 'fileUpload';
  const FieldTag: ElementType = isGroup ? 'fieldset' : isOption || isFileUpload ? 'div' : 'label';
  const LabelTag: ElementType = isGroup ? 'legend' : 'span';
  const ControlTag: ElementType = isGroup || isOption || isFileUpload ? 'div' : 'span';
  const labelId = isOption ? `${resolvedId}-label` : undefined;

  const targetHasValue = (target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) => (
    'checked' in target && target.type === 'checkbox' ? target.checked : target.value !== ''
  );

  const handleFocus = () => setIsFocused(true);

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setIsFocused(false);
    setHasValue(targetHasValue(e.target));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setHasValue(targetHasValue(e.target));
    onChange?.(e);
  };

  const valueProps = value !== undefined
    ? { value }
    : defaultValue !== undefined
      ? { defaultValue }
      : {};

  const resolvedOptions = options.length > 0 ? options : [
    { label: 'Option One', value: 'option-1' },
    { label: 'Option Two', value: 'option-2' },
    { label: 'Option Three', value: 'option-3' },
  ];

  const errorDescription = errorMessage ?? helpText;
  const isChecked = (optionValue: string) => value !== undefined ? value === optionValue : undefined;
  const isOptionChecked = value !== undefined ? value === 'true' : undefined;

  const optionId = (optionValue: string, index: number) => {
    const safeValue = optionValue.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `${resolvedId}-${safeValue || index}`;
  };

  const renderField = () => {
    switch (entryType) {
      case 'email':
      case 'password':
      case 'search':
      case 'text':
      case 'tel':
      case 'url':
        return (
          <>
            <input
              type={entryType}
              name={entryName ?? resolvedId}
              id={resolvedId}
              aria-describedby={describedBy}
              placeholder={placeholder ?? undefined}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required={required}
              {...valueProps}
            />
            {buttonLabel && (
              <button type='submit' className='button'>{buttonLabel}</button>
            )}
          </>
        );

      case 'textarea':
        return (
          <textarea
            rows={rows}
            name={entryName ?? resolvedId}
            id={resolvedId}
            aria-describedby={describedBy}
            placeholder={placeholder ?? undefined}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required={required}
            {...valueProps}
          />
        );

      case 'select':
        return (
          <select
            id={resolvedId}
            name={entryName ?? resolvedId}
            aria-describedby={describedBy}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            required={required}
            {...valueProps}
          >
            <option value=''>{emptyOptionLabel}</option>
            {resolvedOptions.map((option) => (
              <option value={option.value} key={option.value}>{option.label}</option>
            ))}
          </select>
        );

      case 'groupRadio': {
        return (
          <>
            {resolvedOptions.map((option, index) => (
              <div className='form-entry__option__radio' key={option.value}>
                <label>
                  <input
                    required={index === 0 && required}
                    type='radio'
                    name={entryName ?? resolvedId}
                    id={optionId(option.value, index)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    value={option.value}
                    checked={isChecked(option.value)}
                    onChange={handleChange}
                  />
                  <span className='option__label'>{option.label}</span>
                </label>
              </div>
            ))}
          </>
        );
      }

      case 'groupCheck': {
        return (
          <>
            {resolvedOptions.map((option, index) => (
              <div className='form-entry__option__check' key={option.value}>
                <label>
                  <input
                    type='checkbox'
                    name={entryName ?? resolvedId}
                    id={optionId(option.value, index)}
                    value={option.value}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <span className='option__label'>{option.label}</span>
                </label>
              </div>
            ))}
          </>
        );
      }

      case 'singleCheck':
        return (
          <div className='form-entry__option__check'>
            <label aria-labelledby={labelId}>
              <input
                type='checkbox'
                name={entryName ?? resolvedId}
                id={resolvedId}
                value='true'
                checked={isOptionChecked}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <span className='option__label'>{optionLabel}</span>
            </label>
          </div>
        );

      case 'singleCheckSwitch':
        return (
          <div className='form-entry__option__switch'>
            <label aria-labelledby={labelId}>
              <input
                type='checkbox'
                name={entryName ?? resolvedId}
                id={resolvedId}
                value='true'
                checked={isOptionChecked}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <span className='switch__slider' />
              <span className='option__label'>{optionLabel}</span>
            </label>
          </div>
        );

      case 'fileUpload':
        return (
          <label className='file-upload'>
            <span className='file-upload__drop'>
              <span className='file-upload__drop__text'>{fileDropText}</span>
            </span>
            <input
              className='file-upload__input'
              type='file'
              name={entryName ?? resolvedId}
              id={resolvedId}
              accept={fileAccept}
              onChange={handleChange}
            />
            <span className='button button--outline file-upload__button'>
              <span className='icon icon-upload' aria-hidden='true' />
              <span className='text'>{fileButtonText}</span>
            </span>
          </label>
        );

      default:
        return null;
    }
  };

  return (
    <div ref={ref} className={classNames('form-entry', { 'is-invalid': showError, 'has-value': hasValue, 'is-focused': isFocused && !isGroup }, utilities)} data-required={required ? 'true' : undefined}>
      <FieldTag className={classNames('form-entry__field', { 'form-entry__field--float': labelFloat })}>
        <LabelTag id={labelId} className={classNames('form-entry__field__label', { 'screen-reader-only': !labelVisible })}>
          {labelText}
        </LabelTag>

        {showError && (
          <small className='form-entry__feedback' id={feedbackId}>
            <span className='icon icon-warn' aria-hidden='true' />
            <span className='message'>
              <strong>{errorTitle}</strong>{errorDescription ? <> {errorDescription}</> : null}
            </span>
          </small>
        )}

        <ControlTag className={classNames({
          'form-entry__field__input': ['email', 'password', 'search', 'text', 'tel', 'textarea', 'url', 'fileUpload'].includes(entryType),
          'form-entry__field__select': entryType === 'select',
          'form-entry__option': ['groupRadio', 'groupCheck', 'singleCheck', 'singleCheckSwitch'].includes(entryType),
        })}>
          {renderField()}
        </ControlTag>
      </FieldTag>

      {helpText && (
        <small className='form-entry__help' id={helpId}>
          {helpText}
        </small>
      )}
    </div>
  );
};

export default FormEntry;

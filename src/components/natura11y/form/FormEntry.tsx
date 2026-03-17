import { useState, useId, type Ref, type ChangeEvent, type FocusEvent, type ElementType } from 'react';
import classNames from 'classnames';

type EntryType =
  | 'text' | 'email' | 'password' | 'search' | 'tel' | 'url'
  | 'textarea' | 'select'
  | 'groupRadio' | 'groupCheck' | 'singleCheck' | 'singleCheckSwitch'
  | 'fileUpload';

type ChangeHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;

interface FormEntryProps {
  ref?: Ref<HTMLDivElement>;
  labelText?: string;
  labelVisible?: boolean;
  labelFloat?: boolean;
  helpText?: string | null;
  required?: boolean;
  showError?: boolean;
  entryType?: EntryType;
  entryId?: string | null;
  entryName?: string | null;
  onChange?: ChangeHandler | null;
  ariaDescribedBy?: string | null;
  buttonLabel?: string | null;
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
  entryType = 'text',
  entryId = null,
  entryName = null,
  onChange = null,
  ariaDescribedBy = null,
  buttonLabel = null,
  utilities = null,
}: FormEntryProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const generatedId = useId();
  const resolvedId = entryId ?? generatedId;
  const helpId = ariaDescribedBy ?? `help-${resolvedId}`;

  const isGroup = entryType === 'groupRadio' || entryType === 'groupCheck';
  const FieldTag: ElementType = isGroup ? 'fieldset' : 'label';
  const LabelTag: ElementType = isGroup ? 'legend' : 'span';

  const handleFocus = () => setIsFocused(true);

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value !== '');
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
              aria-describedby={helpId}
              onChange={onChange ?? undefined}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required={required}
            />
            {buttonLabel && (
              <button className='button'>{buttonLabel}</button>
            )}
          </>
        );

      case 'textarea':
        return (
          <textarea
            rows={8}
            name={entryName ?? resolvedId}
            id={resolvedId}
            aria-describedby={helpId}
            onChange={onChange ?? undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        );

      case 'select':
        return (
          <select
            id={resolvedId}
            name={entryName ?? resolvedId}
            aria-describedby={helpId}
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

      case 'groupRadio': {
        const radioOptions = ['Option One', 'Option Two', 'Option Three', 'Option Four'];
        return (
          <>
            {radioOptions.map((radio, index) => (
              <div className='form-entry__option__radio' key={index}>
                <label>
                  <input
                    required={index === 0 && required}
                    type='radio'
                    name={entryName ?? resolvedId}
                    id={`${resolvedId}-radio-${index}`}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    value={`option-${index}`}
                    onChange={onChange ?? undefined}
                  />
                  <span className='option__label'>{radio}</span>
                </label>
              </div>
            ))}
          </>
        );
      }

      case 'groupCheck': {
        const checkOptions = ['Option One', 'Option Two', 'Option Three', 'Option Four'];
        return (
          <>
            {checkOptions.map((check, index) => (
              <div className='form-entry__option__check' key={index}>
                <label>
                  <input
                    type='checkbox'
                    name={entryName ?? resolvedId}
                    id={`${resolvedId}-check-${index}`}
                    value={`option-${index}`}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <span className='option__label'>{check}</span>
                </label>
              </div>
            ))}
          </>
        );
      }

      case 'singleCheck':
        return (
          <div className='form-entry__option__check'>
            <label>
              <input
                type='checkbox'
                name={entryName ?? resolvedId}
                id={resolvedId}
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
                  name={entryName ?? resolvedId}
                  id={resolvedId}
                  value='option'
                />
                <span className='switch__slider' />
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
              name={entryName ?? resolvedId}
              id={resolvedId}
              accept='image/*'
            />
            <span className='button button--outline file-upload__button'>
              <span className='icon icon-upload' />
              <span className='text'>Browse for a File</span>
            </span>
          </span>
        );

      default:
        return null;
    }
  };

  return (
    <div ref={ref} className={classNames('form-entry', { 'is-invalid': showError, 'has-value': hasValue, 'is-focused': isFocused && !isGroup }, utilities)} data-required={required}>
      <FieldTag className={classNames('form-entry__field', { 'form-entry__field--float': labelFloat })}>
        <LabelTag className={classNames('form-entry__field__label', { 'screen-reader-only': !labelVisible })}>
          {labelText}
        </LabelTag>

        {showError && (
          <small className='form-entry__feedback'>
            <span className='icon icon-warn' aria-hidden='true' />
            <span className='message'>
              <strong>Custom Error Message</strong> {helpText}
            </span>
          </small>
        )}

        <span className={classNames({
          'form-entry__field__input': ['email', 'password', 'search', 'text', 'tel', 'textarea', 'url', 'fileUpload'].includes(entryType),
          'form-entry__field__select': entryType === 'select',
          'form-entry__option': ['groupRadio', 'groupCheck', 'singleCheck', 'singleCheckSwitch'].includes(entryType),
        })}>
          {renderField()}
        </span>
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
import { useState, useId, useRef, useCallback, type Ref } from 'react';
import classNames from 'classnames';
import Button from '../button';
import ButtonIconOnly from '../button/ButtonIconOnly';
import { useMergedRefs } from '../../hooks/useMergedRefs';

interface FormEntrySearchProps {
  ref?: Ref<HTMLInputElement>;
  id?: string;
  name?: string;
  labelText?: string;
  labelVisible?: boolean;
  placeholder?: string | null;
  defaultValue?: string;
  leadingIcon?: boolean;
  submitButton?: 'text' | 'icon' | null;
  submitLabel?: string;
  fieldInputUtilities?: string | null;
  onSearch?: ((value: string) => void) | null;
  onSubmit?: (() => void) | null;
  onClear?: (() => void) | null;
  utilities?: string | null;
}

const FormEntrySearch = ({
  ref,
  id,
  name,
  labelText = 'Search',
  labelVisible = false,
  placeholder = null,
  defaultValue = '',
  leadingIcon = true,
  submitButton = null,
  submitLabel = 'Search',
  fieldInputUtilities = null,
  onSearch = null,
  onSubmit = null,
  onClear = null,
  utilities = null,
}: FormEntrySearchProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRefs(inputRef, ref);

  const [hasValue, setHasValue] = useState(defaultValue !== '');
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHasValue(value !== '');
    onSearch?.(value);
  }, [onSearch]);

  const handleClear = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
    setHasValue(false);
    onSearch?.('');
    onClear?.();
  }, [onSearch, onClear]);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  return (
    <div className={classNames('form-entry', 'form-entry--search', { 'has-value': hasValue, 'is-focused': isFocused }, utilities)}>
      <label className='form-entry__field'>
        <span className={classNames('form-entry__field__label', { 'screen-reader-only': !labelVisible })}>
          {labelText}
        </span>
        <span className={classNames('form-entry__field__input', fieldInputUtilities)}>
          {leadingIcon && (
            <span className='icon icon-search opacity-50' aria-hidden='true' />
          )}

          <input
            ref={mergedRef}
            type='search'
            id={inputId}
            name={name}
            placeholder={placeholder ?? undefined}
            defaultValue={defaultValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          <button
            type='button'
            className='button button--icon-only'
            data-search-clear=''
            aria-label='Clear search'
            aria-controls={inputId}
            onClick={handleClear}
          >
            <span className='icon icon-clear' aria-hidden='true' />
          </button>

          {submitButton === 'text' && (
            <Button buttonType='submit' title={submitLabel} onClick={onSubmit} />
          )}

          {submitButton === 'icon' && (
            <ButtonIconOnly buttonType='submit' iconHandle='search' ariaLabel={submitLabel} utilities='theme-primary' onClick={onSubmit} />
          )}
        </span>
      </label>
    </div>
  );
};

export default FormEntrySearch;

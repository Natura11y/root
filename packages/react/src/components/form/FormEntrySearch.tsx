import {
  useState,
  useId,
  useRef,
  useCallback,
  type ButtonHTMLAttributes,
  type FocusEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type Ref,
} from 'react';
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
  inputAttributes?: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> | null;
  labelAttributes?: HTMLAttributes<HTMLSpanElement> | null;
  clearButtonAttributes?: ButtonHTMLAttributes<HTMLButtonElement> | null;
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
  inputAttributes = null,
  labelAttributes = null,
  clearButtonAttributes = null,
}: FormEntrySearchProps) => {
  const generatedId = useId();
  const {
    id: inputAttributeId,
    name: inputAttributeName,
    placeholder: inputAttributePlaceholder,
    value: inputValue,
    defaultValue: inputDefaultValue,
    onChange: onInputChange,
    onFocus: onInputFocus,
    onBlur: onInputBlur,
    ...restInputAttributes
  } = inputAttributes ?? {};
  const {
    className: labelAttributeClassName,
    ...restLabelAttributes
  } = labelAttributes ?? {};
  const {
    className: clearButtonAttributeClassName,
    onClick: onClearButtonClick,
    ...restClearButtonAttributes
  } = clearButtonAttributes ?? {};
  const inputId = inputAttributeId ?? id ?? generatedId;
  const resolvedDefaultValue = inputDefaultValue ?? defaultValue;
  const isControlled = inputValue !== undefined;

  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRefs(inputRef, ref);

  const [uncontrolledHasValue, setUncontrolledHasValue] = useState(resolvedDefaultValue !== '');
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = isControlled ? String(inputValue ?? '') !== '' : uncontrolledHasValue;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isControlled) setUncontrolledHasValue(value !== '');
    onInputChange?.(e);
    onSearch?.(value);
  }, [isControlled, onInputChange, onSearch]);

  const handleClear = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (inputRef.current && !isControlled) {
      inputRef.current.value = '';
    }
    inputRef.current?.focus();
    setUncontrolledHasValue(false);
    onClearButtonClick?.(event);
    onSearch?.('');
    onClear?.();
  }, [isControlled, onClearButtonClick, onSearch, onClear]);

  const handleFocus = useCallback((event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onInputFocus?.(event);
  }, [onInputFocus]);
  const handleBlur = useCallback((event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onInputBlur?.(event);
  }, [onInputBlur]);

  return (
    <div className={classNames('form-entry', 'form-entry--search', { 'has-value': hasValue, 'is-focused': isFocused }, utilities)}>
      <label className='form-entry__field'>
        <span
          className={classNames(
            'form-entry__field__label',
            { 'screen-reader-only': !labelVisible },
            labelAttributeClassName,
          )}
          {...restLabelAttributes}
        >
          {labelText}
        </span>
        <span className={classNames('form-entry__field__input', fieldInputUtilities)}>
          {leadingIcon && (
            <span className='icon icon-search opacity-50' aria-hidden='true' />
          )}

          <input
            {...restInputAttributes}
            ref={mergedRef}
            type='search'
            id={inputId}
            name={inputAttributeName ?? name}
            placeholder={inputAttributePlaceholder ?? placeholder ?? undefined}
            value={inputValue}
            defaultValue={isControlled ? undefined : resolvedDefaultValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          <button
            {...restClearButtonAttributes}
            type='button'
            className={classNames('button', 'button--icon-only', clearButtonAttributeClassName)}
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

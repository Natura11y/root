import React from 'react';
import { useState, useId, useRef, useCallback } from 'react';

import classNames from 'classnames';

/**
 * FormEntrySearch
 *
 * Variants (controlled via props):
 *
 * 1. Live search (default) — leading icon, clear button only
 *    <FormEntrySearch onSearch={(val) => ...} />
 *
 * 2. Text submit button — leading icon, clear button, "Search" button
 *    <FormEntrySearch submitButton='text' onSubmit={() => ...} />
 *
 * 3. Icon-only submit button — no leading icon, clear button, icon button
 *    <FormEntrySearch leadingIcon={false} submitButton='icon' onSubmit={() => ...} />
 *
 * 4. Pre-populated (search results page)
 *    <FormEntrySearch defaultValue='Monarch butterfly' submitButton='text' onSubmit={() => ...} />
 *
 * ref is forwarded to the <input> element for external focus management.
 */

const FormEntrySearch = ({
	ref,
	id,
	name,
	labelText = 'Search',
	labelVisible = false,
	placeholder = null,
	defaultValue = '',
	leadingIcon = true,
	submitButton = null,  // null | 'text' | 'icon'
	submitLabel = 'Search',
	onSearch = null,
	onSubmit = null,
	onClear = null,
	utilities = null,
}) => {

	const generatedId = useId();
	const inputId = id || generatedId;

	const inputRef = useRef(null);
	const resolvedRef = ref ?? inputRef;

	const [hasValue, setHasValue] = useState(defaultValue !== '');
	const [isFocused, setIsFocused] = useState(false);

	const formEntryClasses = classNames(
		'form-entry',
		'form-entry--search',
		{
			'has-value': hasValue,
			'is-focused': isFocused,
		},
		utilities
	);

	const labelClass = classNames(
		'form-entry__field__label',
		{ 'screen-reader-only': !labelVisible }
	);

	const handleChange = useCallback((e) => {
		const value = e.target.value;
		setHasValue(value !== '');
		onSearch?.(value);
	}, [onSearch]);

	const handleClear = useCallback(() => {
		if (resolvedRef.current) {
			resolvedRef.current.value = '';
			resolvedRef.current.focus();
		}
		setHasValue(false);
		onSearch?.('');
		onClear?.();
	}, [resolvedRef, onSearch, onClear]);

	const handleFocus = useCallback(() => setIsFocused(true), []);
	const handleBlur = useCallback(() => setIsFocused(false), []);

	return (
		<div className={formEntryClasses}>
			<label className='form-entry__field'>
				<span className={labelClass}>{labelText}</span>
				<span className='form-entry__field__input'>

					{leadingIcon && (
						<span className='icon icon-search opacity-50' aria-hidden='true'></span>
					)}

					<input
						ref={resolvedRef}
						type='search'
						id={inputId}
						name={name}
						placeholder={placeholder}
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
						<span className='icon icon-clear' aria-hidden='true'></span>
					</button>

					{submitButton === 'text' && (
						<button
							type='submit'
							className='button theme-primary'
							onClick={onSubmit}
						>
							{submitLabel}
						</button>
					)}

					{submitButton === 'icon' && (
						<button
							type='submit'
							className='button button--icon-only theme-primary'
							aria-label={submitLabel}
							onClick={onSubmit}
						>
							<span className='icon icon-search' aria-hidden='true'></span>
						</button>
					)}

				</span>
			</label>
		</div>
	);
};

export default FormEntrySearch;

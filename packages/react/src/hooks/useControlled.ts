import { useRef, useState, useCallback, useEffect } from 'react';

/**
 * Manages the state of a controlled/uncontrolled component.
 *
 * Pass `controlled` when the parent owns the state (controlled mode).
 * Pass `default` for the initial value when the parent does not (uncontrolled mode).
 * The mode is locked after the first render — switching between modes is not supported.
 */
export function useControlled<T>({
  controlled,
  default: defaultProp,
  name,
  state = 'value',
}: {
  controlled: T | undefined;
  default: T | undefined;
  name: string;
  state?: string;
}): [T, (next: T | ((prev: T) => T)) => void] {
  const { current: isControlled } = useRef(controlled !== undefined);
  const [valueState, setValue] = useState(defaultProp);
  const value = isControlled ? controlled : valueState;

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (isControlled !== (controlled !== undefined)) {
        console.error(
          [
            `Natura11y: A component is changing the ${isControlled ? '' : 'un'}controlled ${state} state of ${name} to be ${isControlled ? 'un' : ''}controlled.`,
            'Elements should not switch from uncontrolled to controlled (or vice versa).',
            `Decide between using a controlled or uncontrolled ${name} for the lifetime of the component.`,
            "The mode is determined on the first render: controlled if the value is not undefined, uncontrolled otherwise.",
          ].join('\n')
        );
      }
    }, [controlled, isControlled, name, state]);
  }

  const setValueIfUncontrolled = useCallback((next: T | ((prev: T) => T)) => {
    if (!isControlled) {
      setValue(next as T);
    }
  }, [isControlled]);

  return [value as T, setValueIfUncontrolled];
}

import { useRef, useLayoutEffect, useCallback } from 'react';

type AnyFunction = (...args: any[]) => any;

/**
 * Returns a stable function reference that always calls the latest version of the callback.
 *
 * The returned function never changes between renders, so it can be passed to event listeners
 * and useEffect dependency arrays without causing unnecessary re-runs. The callback itself
 * is always up to date — no stale closure issues.
 *
 * Only call the returned function inside effects and event handlers, never during render.
 */
export function useStableCallback<T extends AnyFunction>(fn: T | undefined): T {
  const fnRef = useRef(fn);

  useLayoutEffect(() => {
    fnRef.current = fn;
  });

  return useCallback((...args: Parameters<T>) => fnRef.current?.(...args), []) as T;
}

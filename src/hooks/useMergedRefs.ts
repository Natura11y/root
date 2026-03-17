import { useCallback } from 'react';
import type { Ref, MutableRefObject, RefCallback } from 'react';

type InputRef<T> = Ref<T> | null | undefined;

/**
 * Merges multiple refs into a single callback ref.
 * Useful when a component needs to forward a ref while also keeping its own internal ref.
 */
export function useMergedRefs<T>(...refs: InputRef<T>[]): RefCallback<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as MutableRefObject<T | null>).current = node;
      }
    }
  }, refs); // refs are typically stable (useRef objects or forwarded refs)
}

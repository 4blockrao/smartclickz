
import { useEffect, useState } from "react";

/**
 * Debounce a value, returning the debounced version.
 * @param value The value to debounce.
 * @param delay Delay in ms, default 300ms.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

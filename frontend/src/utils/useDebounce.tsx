import { useEffect } from 'react';
import { useImmer } from 'use-immer';

/**
 * Source: {@link: https://usehooks-ts.com/react-hook/use-debounce}
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useImmer<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

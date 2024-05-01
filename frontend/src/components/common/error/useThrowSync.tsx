import { useCallback } from 'react';
import { ErrorWithMessage } from './ErrorWithMessage';
import { useImmer } from 'use-immer';

/**
 * Allow errors in async calls to be caught by error boundaries
 */
export const useThrowSync = () => {
  const [, setError] = useImmer(null);
  return useCallback(
    (e: ErrorWithMessage) => {
      setError(() => {
        throw e;
      });
    },
    [setError],
  );
};

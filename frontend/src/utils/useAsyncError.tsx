import { useCallback, useState } from 'react';
import { ErrorWithMessage } from '../components/ErrorHandler';

/**
 * Convert async into sync error catchable by error boundaries
 */
export const useAsyncError = () => {
  const [, setError] = useState();
  return useCallback(
    (e: ErrorWithMessage) => {
      setError(() => {
        throw e;
      });
    },
    [setError],
  );
};

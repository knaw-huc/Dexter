import { useCallback, useState } from 'react';
import { ErrorWithMessage } from './ErrorWithMessage';

/**
 * Make async errors 'synchronous' again,
 * allowing errors to be caught by error boundaries
 */
export const useThrowSync = () => {
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

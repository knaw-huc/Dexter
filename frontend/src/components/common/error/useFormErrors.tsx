import { useEffect } from 'react';
import _ from 'lodash';
import { ValidationError } from 'yup';
import { FormErrors } from './FormError';
import { ErrorWithMessage } from './ErrorWithMessage';
import { scrollToError } from './scrollToError';
import { isResponseError } from '../isResponseError';
import { useImmer } from 'use-immer';
import { set } from '../../../utils/draft/set';

type UseFormErrorsResult<T> = {
  errors: FormErrors<T>;

  /**
   * Set error
   * When passing null, errors will be cleared
   * @param error
   */
  setError: (error: Error | null) => Promise<void>;

  setFieldError: (field: keyof T, error: ErrorWithMessage) => void;
  clearErrors: () => void;
};

const constraintToError: Record<
  string,
  { field: string; error: ErrorWithMessage }
> = {
  UNIQUE_TITLE_CONSTRAINT: {
    field: 'title',
    error: { message: 'Title already exists' },
  },
  MEDIA_UNIQUE_URL_CONSTRAINT: {
    field: 'url',
    error: { message: 'Media entry with this url already exists' },
  },
};

/**
 * Parse errors and assign to form field when possible
 *
 * Filter backend errors by their message constraint,
 * or return 'generic' error
 */
export function useFormErrors<T extends object>(): UseFormErrorsResult<T> {
  const [errors, setErrors] = useImmer<FormErrors<T>>({} as FormErrors<T>);

  useEffect(scrollToError, [errors]);

  async function setFormError(error: Error): Promise<void> {
    if (!error) {
      clearErrors();
    } else if (isResponseError(error)) {
      const responseError = error.body;
      const constraints = _.entries(constraintToError);
      for (const [constraint, { field, error }] of constraints) {
        if (responseError.message.includes(constraint)) {
          setErrors(draft => set(draft, field, error));
          return;
        }
      }
      if (responseError.message) {
        setErrors(draft => set(draft, 'generic', error));
      }
    } else if (isValidationError(error)) {
      setErrors(draft => set(draft, error.path, error));
    } else {
      setErrors(draft => set(draft, 'generic', error));
    }
  }

  function clearErrors() {
    setErrors({} as FormErrors<T>);
  }

  function isValidationError(error: Error): error is ValidationError {
    return !!(error as ValidationError).path;
  }

  function setFieldError(key: keyof T, e: Error) {
    setErrors(draft => set(draft, key as string, e));
  }

  return { errors, setError: setFormError, clearErrors, setFieldError };
}

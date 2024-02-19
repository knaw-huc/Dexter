import { useState } from 'react';
import { ResponseError } from '../../utils/API';
import { FormErrors } from './FormError';
import { ErrorWithMessage } from '../ErrorHandler';
import _ from 'lodash';
import { ValidationError } from 'yup';

type UseFormErrorsResult<T> = {
  errors: FormErrors<T>;
  setError: (error: Error) => Promise<void>;
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
export function useFormErrors<T>(): UseFormErrorsResult<T> {
  const [errors, setErrors] = useState<FormErrors<T>>({} as FormErrors<T>);
  async function setFormError<T>(error: Error): Promise<void> {
    if (isResponseError(error)) {
      const responseError = await error.response.json();
      for (const [constraint, { field, error }] of _.entries(
        constraintToError,
      )) {
        if (responseError.message.includes(constraint)) {
          return setErrors(prev => _.set({ ...prev }, field as keyof T, error));
        }
      }
      if (responseError.message) {
        return setErrors(f => ({ ...f, generic: responseError }));
      }
    } else if (isValidationError(error)) {
      return setErrors(prev =>
        _.set({ ...prev }, error.path as keyof T, error),
      );
    }
    setErrors(prev => ({ ...prev, generic: error }));
  }

  function clearErrors() {
    setErrors({} as FormErrors<T>);
  }

  function isResponseError(error: Error): error is ResponseError {
    return !!(error as ResponseError).response;
  }
  function isValidationError(error: Error): error is ValidationError {
    return !!(error as ValidationError).path;
  }

  function setFieldError(key: keyof T, e: Error) {
    setErrors(prev => _.set({ ...prev }, key, e));
  }

  return { errors, setError: setFormError, clearErrors, setFieldError };
}

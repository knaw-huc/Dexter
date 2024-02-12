import { ResponseError } from '../../utils/API';
import React, { Dispatch, SetStateAction, useRef } from 'react';
import { Alert } from '@mui/material';
import { ERROR_MESSAGE_CLASS } from './ErrorMessage';
import { ValidationError } from 'yup';
import { ErrorWithMessage } from '../ErrorHandler';
import _ from 'lodash';

export function FormErrorMessage(props: { error?: ErrorWithMessage }) {
  const formError = props.error;
  const ref = useRef(null);

  if (!formError) {
    return null;
  }

  return (
    <Alert ref={ref} className={ERROR_MESSAGE_CLASS} severity="error">
      An error occurred: {formError.message}
    </Alert>
  );
}

function isResponseError(error: Error): error is ResponseError {
  return !!(error as ResponseError).response;
}

function isValidationError(error: Error): error is ValidationError {
  return !!(error as ValidationError).path;
}

/**
 * Filter backend errors by their message constraint,
 * or return 'generic' error
 */
export async function setFormErrors<T>(
  error: Error,
  dispatch: DispatchFormError<T>,
): Promise<void> {
  if (isResponseError(error)) {
    const errorResponseBody = await error.response.json();
    if (errorResponseBody.message.includes('UNIQUE_TITLE_CONSTRAINT')) {
      const title = { message: 'Title already exists' };
      return dispatch(prev => ({ ...prev, title }));
    }
  } else if (isValidationError(error)) {
    return dispatch(prev => _.set({ ...prev }, error.path as keyof T, error));
  }
  dispatch(prev => ({ ...prev, generic: error }));
}

export type FormField<T> = keyof T | 'generic';
export type FormErrors<T> = Record<FormField<T>, ErrorWithMessage>;
type DispatchFormError<T> = Dispatch<SetStateAction<FormErrors<T>>>;

export function scrollToError() {
  document
    .getElementsByClassName(ERROR_MESSAGE_CLASS)[0]
    ?.scrollIntoView({ behavior: 'smooth' });
}

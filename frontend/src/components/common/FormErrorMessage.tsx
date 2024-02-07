import { ResponseError } from '../../utils/API';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { Alert } from '@mui/material';
import { ERROR_MESSAGE_CLASS } from './ErrorMsg';

export function FormErrorMessage<T>(props: { error?: ErrorByField<T> }) {
  const formError = props.error;
  const ref = useRef(null);
  useEffect(() => {
    if (formError?.error) {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [formError, ref.current]);

  if (!formError || formError.field !== GENERIC) {
    return null;
  }

  return (
    <Alert ref={ref} className={ERROR_MESSAGE_CLASS} severity="error">
      An error occurred: {formError.error.message}
    </Alert>
  );
}

function isResponseError(error: Error): error is ResponseError {
  return !!(error as ResponseError).response;
}

export function toErrorByField<T>(
  field: FormField<T>,
  message: string,
): ErrorByField<T> {
  return {
    field: field,
    error: { message },
  };
}

type WithTitle = { title: string };

/**
 * Filter backend errors by their message constraint,
 * or return generic {@link GENERIC} error
 */

// TODO: Edit corpus form, submit without title -> "An error occurred: Title is required"
export async function setFormFieldErrors<T extends WithTitle>(
  error: Error,
  dispatch: DispatchError<T>,
) {
  let newError: ErrorByField<T>;
  if (isResponseError(error)) {
    const errorResponseBody = await error.response.json();
    if (errorResponseBody.message.includes('UNIQUE_TITLE_CONSTRAINT')) {
      newError = {
        field: 'title',
        error: { message: 'Title already exists' },
      };
    }
  } else {
    newError = toErrorByField(GENERIC, error.message);
  }

  dispatch(prev => putErrorByField(prev, newError));
}

export function putErrorByField<T>(
  prev: ErrorByField<T>[],
  newError: ErrorByField<T>,
) {
  const found = prev.findIndex(e => e.field === newError.field);
  if (found === -1) {
    return [...prev, newError];
  } else {
    prev[found] = newError;
  }
}

export type GenericFormError = Pick<Error, 'message'>;
export type FormField<T> = keyof T | 'generic';
export type ErrorByField<T> = { field: FormField<T>; error: GenericFormError };
type DispatchError<T> = Dispatch<SetStateAction<ErrorByField<T>[]>>;
export const GENERIC = 'generic';

export function getErrorMessage<T>(
  field: keyof T,
  errors: ErrorByField<T>[],
): string | undefined {
  const found = errors.find(f => f.field === field);
  if (found) {
    return found.error.message;
  }
}

export function scrollToError() {
  document
    .getElementsByClassName(ERROR_MESSAGE_CLASS)[0]
    ?.scrollIntoView({ behavior: 'smooth' });
}

import { ResponseError } from '../../utils/API';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { Alert } from '@mui/material';
import { ERROR_MESSAGE_CLASS } from './ErrorMsg';
import { ValidationError } from 'yup';
import { upsert } from '../../utils/upsert';

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

function isValidationError(error: Error): error is ValidationError {
  return !!(error as ValidationError).path;
}

type WithTitle = { title: string };

/**
 * Filter backend errors by their message constraint,
 * or return generic {@link GENERIC} error
 */

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
  }
  if (isValidationError(error)) {
    newError = new ErrorByField<T>(error.path as keyof T, error.message);
  }
  if (!newError) {
    newError = new ErrorByField<T>(GENERIC, error.message);
  }
  dispatch(prev => upsertFieldError(prev, newError));
}

export function upsertFieldError<T>(
  prev: ErrorByField<T>[],
  update: ErrorByField<T>,
) {
  return upsert(prev, update, e => e.field === update.field);
}

export type GenericFormError = Pick<Error, 'message'>;
export type FormField<T> = keyof T | 'generic';

export class ErrorByField<T> {
  public error: GenericFormError;

  constructor(public field: FormField<T>, message: string) {
    this.error = { message };
  }
}

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

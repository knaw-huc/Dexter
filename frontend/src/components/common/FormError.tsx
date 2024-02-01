import { ResponseError } from '../../utils/API';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { Alert } from '@mui/material';
import { ERROR_MESSAGE_CLASS } from './ErrorMsg';

export function FormError(props: { error?: ErrorByField }) {
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

export function toField(field: FormField, message: string) {
  return {
    field: field,
    error: { message },
  };
}

/**
 * Filter backend errors by their message constraint,
 * or return generic {@link GENERIC} error
 */
export async function filterFormFieldErrors(
  error: Error,
  dispatch: DispatchError,
) {
  if (isResponseError(error)) {
    const errorResponseBody = await error.response.json();
    if (errorResponseBody.message.includes('UNIQUE_TITLE_CONSTRAINT')) {
      dispatch({
        field: 'title',
        error: { message: 'Title already exists' },
      });
    }
  } else {
    dispatch(toField(GENERIC, error.message));
  }
}

export type GenericFormError = Pick<Error, 'message'>;
export type FormField = string | 'generic';
export type ErrorByField = { field: FormField; error: GenericFormError };
type DispatchError = Dispatch<SetStateAction<ErrorByField>>;
export const GENERIC = 'generic';

export function scrollToError() {
  document
    .getElementsByClassName(ERROR_MESSAGE_CLASS)[0]
    ?.scrollIntoView({ behavior: 'smooth' });
}

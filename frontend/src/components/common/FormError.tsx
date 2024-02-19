import React, { useRef } from 'react';
import { Alert } from '@mui/material';
import { ERROR_MESSAGE_CLASS } from './ErrorMessage';
import { ErrorWithMessage } from '../ErrorHandler';

export function FormErrorMessage(props: { error?: ErrorWithMessage }) {
  const formError = props.error;
  const ref = useRef(null);

  if (!formError) {
    return null;
  }

  return (
    <Alert
      ref={ref}
      className={ERROR_MESSAGE_CLASS}
      severity="error"
      style={{ marginBottom: '0.5em' }}
    >
      An error occurred: {formError.message}
    </Alert>
  );
}

export type FormField<T> = keyof T | 'generic';
export type FormErrors<T> = Record<FormField<T>, ErrorWithMessage>;

export function scrollToError() {
  document
    .getElementsByClassName(ERROR_MESSAGE_CLASS)[0]
    ?.scrollIntoView({ behavior: 'smooth' });
}

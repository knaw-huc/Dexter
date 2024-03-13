import React from 'react';
import { ErrorAlert } from './ErrorAlert';
import { ErrorWithMessage } from './ErrorWithMessage';

export function FormErrorMessage(props: { error?: ErrorWithMessage }) {
  const formError = props.error;

  if (!formError) {
    return null;
  }

  return <ErrorAlert message={formError.message} />;
}

export type FormField<T> = keyof T | 'generic';
export type FormErrors<T> = Record<FormField<T>, ErrorWithMessage>;

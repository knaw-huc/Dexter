import React from 'react';
import { ERROR_MESSAGE_CLASS } from './ErrorMessage';
import { ErrorWithMessage } from '../ErrorHandler';
import { ErrorAlert } from './ErrorAlert';

export function FormErrorMessage(props: { error?: ErrorWithMessage }) {
  const formError = props.error;

  if (!formError) {
    return null;
  }

  return <ErrorAlert message={formError.message} />;
}

export type FormField<T> = keyof T | 'generic';
export type FormErrors<T> = Record<FormField<T>, ErrorWithMessage>;

export function scrollToError() {
  document
    .getElementsByClassName(ERROR_MESSAGE_CLASS)[0]
    ?.scrollIntoView({ behavior: 'smooth' });
}

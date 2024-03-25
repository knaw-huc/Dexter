import { ErrorWithMessage } from './error/ErrorWithMessage';
import { ReactNode } from 'react';

/**
 * Form field are capable to display custom labels and errors
 */
export type FormFieldprops = {
  label?: ReactNode;
  error?: ErrorWithMessage;
};

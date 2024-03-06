import { ErrorWithMessage } from './error/ErrorWithMessage';

/**
 * Form field are capable to display custom labels and errors
 */
export type FormFieldprops = {
  label?: string;
  error?: ErrorWithMessage;
};

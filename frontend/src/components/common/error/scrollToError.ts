import { ERROR_MESSAGE_CLASS } from './FieldError';

export function scrollToError() {
  document
    .getElementsByClassName(ERROR_MESSAGE_CLASS)[0]
    ?.scrollIntoView({ behavior: 'smooth' });
}

import { isResponseError } from '../isResponseError';
import { toConstraint } from './toConstraint';
import { ErrorWithMessage } from './ErrorWithMessage';

export function toMessage(error: ErrorWithMessage) {
  if (!error) {
    return 'An error occurred';
  }
  if (isResponseError(error)) {
    const body = error.body;
    if (body?.message) {
      return toResponseMessage(body.message, error.response.url);
    } else {
      return error.response.statusText;
    }
  }
  return error.message;
}

function toResponseMessage(message: string, url: string) {
  const foundConstraint = toConstraint(message, url);
  return foundConstraint?.message || message;
}

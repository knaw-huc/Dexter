import { isResponseError } from '../isResponseError';
import { toConstraint } from './toConstraint';

export function toMessage(error: Error) {
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

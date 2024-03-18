import { isResponseError } from '../isResponseError';

export function toMessage(error: Error) {
  if (!error) {
    return '';
  } else if (isResponseError(error)) {
    const body = error.json;
    return body.message;
  } else {
    return error.message;
  }
}

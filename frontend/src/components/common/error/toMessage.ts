import { isResponseError } from '../isResponseError';

export function toMessage(error: Error) {
  if (!error) {
    return 'An error occurred';
  }
  if (isResponseError(error)) {
    const body = error.body;
    if (body) {
      return body?.message;
    } else {
      return error.response.statusText;
    }
  }
  return error.message;
}

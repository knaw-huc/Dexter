import { ResponseError } from '../../utils/API';
import { ErrorWithMessage } from './error/ErrorWithMessage';

export function isResponseError(
  error: ErrorWithMessage,
): error is ResponseError {
  return !!(error as ResponseError).response;
}

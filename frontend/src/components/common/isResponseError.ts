import { ResponseError } from '../../utils/API';

export function isResponseError(error: Error): error is ResponseError {
  return !!(error as ResponseError).response;
}

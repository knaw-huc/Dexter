import { normalize } from '../../utils/normalize';
import _ from 'lodash';

export function truncateInput(
  input: string,
  inputSearchTermLength: number = 70,
) {
  return normalize(
    _.truncate(input, {
      length: inputSearchTermLength,
    }),
  );
}

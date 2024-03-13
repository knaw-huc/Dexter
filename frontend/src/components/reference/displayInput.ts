import { ResultReference } from '../../model/DexterModel';
import _ from 'lodash';

export function displayInput(reference: ResultReference) {
  if (!reference?.input) {
    return '';
  }
  return _.truncate(reference.input, { length: 70 });
}

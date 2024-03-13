import { ResultCitation } from '../../model/DexterModel';
import _ from 'lodash';

export function displayInput(citation: ResultCitation) {
  if (!citation?.input) {
    return '';
  }
  return _.truncate(citation.input, { length: 70 });
}

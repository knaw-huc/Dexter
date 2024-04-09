import { ID } from '../../../../model/DexterModel';
import _ from 'lodash';

export function removeIdsFrom(removeFrom: ID[], ...toRemove: ID[]) {
  _.pull(removeFrom, ...toRemove);
}

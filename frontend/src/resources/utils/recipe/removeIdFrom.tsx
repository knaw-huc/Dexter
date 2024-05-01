import _ from 'lodash';
import { ID } from '../../../model/Id';

export function removeIdFrom(removeFrom: ID[], toRemove: ID) {
  _.pull(removeFrom, toRemove);
}

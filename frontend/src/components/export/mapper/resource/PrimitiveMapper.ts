import { Any } from '../../../common/Any';
import { CellMapper } from './Mapper';
import _ from 'lodash';

export type Primitive = boolean | number | string;

export class PrimitiveMapper implements CellMapper<Primitive> {
  canMap(resource: Any): resource is Primitive {
    return (
      _.isString(resource) || _.isBoolean(resource) || _.isNumber(resource)
    );
  }

  map(value: Primitive): string {
    return String(value);
  }
}

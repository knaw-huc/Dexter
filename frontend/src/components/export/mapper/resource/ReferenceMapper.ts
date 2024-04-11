import { Any } from '../../../common/Any';
import { RowWithHeader } from '../RowWithHeader';
import { RowMapper } from '../Mapper';
import { appendCell } from '../MapperUtils';
import { FormattedReferenceMapper } from './FormattedReferenceMapper';
import { PrimitiveMapper } from './PrimitiveMapper';
import { isReference, Reference } from '../../../../model/Reference';

export class ReferenceMapper implements RowMapper<Reference> {
  constructor(
    private referenceFormatter: FormattedReferenceMapper,
    private primitiveMapper: PrimitiveMapper,
  ) {}

  canMap(resource: Any): resource is Reference {
    return isReference(resource);
  }

  map(reference: Reference, rowName: string): RowWithHeader {
    const result = new RowWithHeader(rowName);
    appendCell(result, 'id', reference.id, this.primitiveMapper);
    appendCell(result, 'input', reference.input, this.primitiveMapper);
    appendCell(result, 'formatted', reference.csl, this.referenceFormatter);
    return result;
  }
}

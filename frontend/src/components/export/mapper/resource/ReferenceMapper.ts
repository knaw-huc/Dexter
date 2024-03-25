import { isReference, Reference } from '../../../../model/DexterModel';
import { Any } from '../../../common/Any';
import { RowWithHeader } from '../RowWithHeader';
import { RowMapper } from '../Mapper';
import { appendCell } from '../MapperUtils';
import { FormattedReferencemapper } from './FormattedReferencemapper';
import { PrimitiveMapper } from './PrimitiveMapper';

export class ReferenceMapper implements RowMapper<Reference> {
  constructor(
    private referenceFormatter: FormattedReferencemapper,
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

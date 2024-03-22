import { isReference, Reference } from '../../../../model/DexterModel';
import { Any } from '../../../common/Any';
import { RowWithHeader } from '../RowWithHeader';
import { RowMapper } from './Mapper';
import { appendCell } from '../ExportUtils';
import { ReferenceFormatter } from './ReferenceFormatter';

export class ReferenceMapper implements RowMapper<Reference> {
  constructor(private referenceFormatter: ReferenceFormatter) {}

  canMap(resource: Any): resource is Reference {
    return isReference(resource);
  }

  map(reference: Reference): RowWithHeader {
    const result = new RowWithHeader();
    appendCell(result, 'id', reference.id);
    appendCell(result, 'input', reference.input);
    appendCell(result, 'formatted', reference.csl, this.referenceFormatter);
    return result;
  }
}

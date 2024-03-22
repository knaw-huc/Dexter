import { Any } from '../../../common/Any';
import { CellMapper } from './Mapper';
import { formatReference } from '../../../reference/formatReference';
import { ReferenceStyle } from '../../../reference/ReferenceStyle';
import { ReferenceType } from '../../../reference/ReferenceType';
import { CslString, isCsl } from '../../../reference/CslJson';
import { ReferenceFormat } from '../../../reference/ReferenceFormat';

export class ReferenceFormatter implements CellMapper<CslString> {
  canMap(resources: Any): resources is CslString {
    return isCsl(resources);
  }

  map(csl: CslString): string {
    return formatReference(
      csl,
      ReferenceStyle.apa,
      ReferenceType.bibliography,
      ReferenceFormat.text,
    );
  }
}

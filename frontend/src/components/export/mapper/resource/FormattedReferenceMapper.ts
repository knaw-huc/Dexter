import { Any } from '../../../common/Any';
import { CellMapper } from '../Mapper';
import { formatReference } from '../../../reference/formatReference';
import { ReferenceStyle } from '../../../reference/ReferenceStyle';
import { ReferenceType } from '../../../reference/ReferenceType';
import { CslString, isCsl } from '../../../reference/CslJson';
import { ReferenceFormat } from '../../../reference/ReferenceFormat';

export class FormattedReferenceMapper implements CellMapper<CslString> {
  constructor(private refererenceStyle: ReferenceStyle) {}

  canMap(resources: Any): resources is CslString {
    return isCsl(resources);
  }

  map(csl: CslString): string {
    return formatReference(
      csl,
      this.refererenceStyle,
      ReferenceType.bibliography,
      ReferenceFormat.text,
    );
  }
}

import { Any } from '../../../common/Any';
import { CellMapper } from '../Mapper';
import { formatReference } from '../../../reference/formatReference';
import { ReferenceStyle } from '../../../reference/ReferenceStyle';
import { ReferenceType } from '../../../reference/ReferenceType';
import { CslString, isCsl } from '../../../../model/CslJson';
import { ReferenceFormat } from '../../../reference/ReferenceFormat';

export class FormattedReferenceMapper implements CellMapper<CslString> {
  constructor(private referenceStyle: ReferenceStyle) {}

  canMap(resource: Any): resource is CslString {
    if (!resource) {
      return true;
    }
    return isCsl(resource);
  }

  map(csl: CslString): string {
    if (!csl) {
      return '';
    }
    return formatReference(
      csl,
      this.referenceStyle,
      ReferenceType.bibliography,
      ReferenceFormat.text,
    );
  }
}

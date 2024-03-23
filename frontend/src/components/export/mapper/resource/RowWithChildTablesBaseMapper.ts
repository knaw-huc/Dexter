import { AnyMapperResult, isCell, isRow, isTables, Mapper } from './Mapper';
import { Any } from '../../../common/Any';
import { RowWithHeader } from '../RowWithHeader';
import { RowWithChildTables } from '../RowWithChildTables';
import { prefixTable } from '../ExportUtils';

export class RowWithChildTablesBaseMapper<RESOURCE> {
  keyToMapper: Partial<Record<keyof RESOURCE, Mapper<Any, AnyMapperResult>>>;
  prefixColumns: RowWithHeader;

  append(result: RowWithChildTables, key: string, mapped: AnyMapperResult) {
    if (isCell(mapped)) {
      result.appendCell(key, mapped);
    } else if (isRow(mapped)) {
      result.appendRow(mapped);
    } else if (isTables(mapped)) {
      mapped.forEach(t => prefixTable(t, this.prefixColumns));
      result.appendTables(mapped);
    }
  }
}

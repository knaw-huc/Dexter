import { AnyMapperResult, isCell, isRow, isTables, Mapper } from './Mapper';
import { Any } from '../../../common/Any';
import { RowWithHeader } from '../RowWithHeader';
import { RowWithChildTables } from '../RowWithChildTables';
import { createTableFrom, prefixHeader, prefixTable } from '../ExportUtils';
import { PrimitiveMapper } from './PrimitiveMapper';
import { WithId } from '../../../../model/DexterModel';

type KeyToMapper<RESOURCE> = Partial<
  Record<keyof RESOURCE, Mapper<Any, AnyMapperResult>>
>;

export class BaseRowWithChildTablesMapper<RESOURCE extends WithId> {
  /**
   * Call specific mapper for properties
   */
  keyToMapper: KeyToMapper<RESOURCE>;

  /**
   * Called when no other mappers found
   */
  primitiveMapper: PrimitiveMapper;

  /**
   * Properties to skip during mapping
   */
  keysToSkip: (keyof RESOURCE)[];

  /**
   * Name denoting resource, used when naming columns and tables
   */
  resourceName: string;

  /**
   * Columns to prefix when mapping results in child tables   */
  columnsNamesToPrefix: (keyof RESOURCE)[];
  prefixColumns: RowWithHeader;

  constructor(
    keyToMapper: KeyToMapper<RESOURCE>,
    primitiveMapper: PrimitiveMapper,
    keysToSkip: (keyof RESOURCE)[] = [],
    columnsNamesToPrefix: (keyof RESOURCE)[] = [],
    resourceName: string,
  ) {
    this.keyToMapper = keyToMapper;
    this.primitiveMapper = primitiveMapper;
    this.keysToSkip = keysToSkip;
    this.resourceName = resourceName;
    this.columnsNamesToPrefix = columnsNamesToPrefix;
  }

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

  map(resource: RESOURCE, tableName: string): RowWithChildTables {
    const result = new RowWithChildTables(tableName);
    this.prefixColumns = createTableFrom(
      tableName,
      resource,
      this.columnsNamesToPrefix,
    );
    prefixHeader(this.prefixColumns, this.resourceName);

    let key: keyof RESOURCE;
    for (key in resource) {
      if (this.keysToSkip.includes(key)) {
        continue;
      }
      const field = resource[key];
      const mapper = this.keyToMapper[key] || this.primitiveMapper;

      if (mapper.canMap(field)) {
        const fieldName = String(key);
        const mapped = mapper.map(field, fieldName);
        this.append(result, key, mapped);
      }
    }
    return result;
  }
}

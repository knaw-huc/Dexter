import { AnyMapperResult, isCell, isRow, isTables, Mapper } from '../Mapper';
import { Any } from '../../../common/Any';
import { RowWithTables } from '../RowWithTables';
import { PrimitiveMapper } from './PrimitiveMapper';
import { WithId } from '../../../../model/DexterModel';

type KeyToMapper<RESOURCE> = Partial<
  Record<keyof RESOURCE, Mapper<Any, AnyMapperResult>>
>;
type KeyToResult<RESOURCE> = Partial<Record<keyof RESOURCE, AnyMapperResult>>;

/**
 * Helper class that creates a record
 * with mapped results for each resource field
 */
export class FieldsMapper<RESOURCE extends WithId> {
  /**
   * Call specific mapper for specific properties
   */
  keyToMapper: KeyToMapper<RESOURCE>;

  /**
   * Call when no other mappers are found
   */
  primitiveMapper: PrimitiveMapper;

  /**
   * Properties to skip during mapping
   */
  keysToSkip: (keyof RESOURCE)[];

  /**
   * Type of resource being mapped
   * Used when naming columns and tables
   */
  resourceName: string;

  constructor(
    keyToMapper: KeyToMapper<RESOURCE>,
    primitiveMapper: PrimitiveMapper,
    keysToSkip: (keyof RESOURCE)[] = [],
    resourceName: string,
  ) {
    this.keyToMapper = keyToMapper;
    this.primitiveMapper = primitiveMapper;
    this.keysToSkip = keysToSkip;
    this.resourceName = resourceName;
  }

  append(result: RowWithTables, key: string, mapped: AnyMapperResult) {
    if (isCell(mapped)) {
      result.appendCell(key, mapped);
    } else if (isRow(mapped)) {
      result.appendRow(mapped);
    } else if (isTables(mapped)) {
      result.appendTables(mapped);
    }
  }

  mapFields(resource: RESOURCE): KeyToResult<RESOURCE> {
    const result: KeyToResult<RESOURCE> = {};
    let key: keyof RESOURCE;
    for (key in resource) {
      if (this.keysToSkip.includes(key)) {
        continue;
      }
      const field = resource[key];
      const mapper = this.keyToMapper[key] || this.primitiveMapper;

      if (mapper.canMap(field)) {
        const fieldName = String(key);
        result[key] = mapper.map(field, fieldName);
      }
    }
    return result;
  }
}

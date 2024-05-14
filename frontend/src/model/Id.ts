import { Any } from '../components/common/Any';

export type UUID = string;
/**
 * ID defaults to UUID, but also supports numbers (i.e. tag IDs)
 */
export type ID = UUID | number;
export type WithId<T extends ID = UUID> = {
  id: T;
};

export function isWithId(resource: Any): resource is WithId {
  return !!(resource as WithId).id;
}

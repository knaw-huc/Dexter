import { BoundState } from '../BoundState';
import { ResultTag } from '../../../model/DexterModel';

export function findTag(
  id: number,
  resources: BoundState,
): ResultTag | undefined {
  return resources.userResources.tags.find(t => t.id === id);
}

import { BoundState } from '../store/BoundState';
import { ResultTag } from '../../model/DexterModel';

export function findTag(
  id: number,
  resources: BoundState,
): ResultTag | undefined {
  return resources.userResources.tags.get(id);
}

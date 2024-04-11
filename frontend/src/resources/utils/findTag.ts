import { BoundState } from '../store/BoundState';

import { ResultTag } from '../../model/Tag';

export function findTag(
  id: number,
  resources: BoundState,
): ResultTag | undefined {
  return resources.userResources.tags.get(id);
}

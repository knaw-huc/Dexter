import { ResultMedia, UUID } from '../../../model/DexterModel';
import { BoundState } from '../BoundState';

export function findMedia(
  id: UUID,
  resources: BoundState,
): ResultMedia | undefined {
  return resources.userResources.media.get(id);
}

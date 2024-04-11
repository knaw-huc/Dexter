import { ResultMedia, UUID } from '../../model/DexterModel';
import { BoundState } from '../store/BoundState';

export function findMedia(
  id: UUID,
  resources: BoundState,
): ResultMedia | undefined {
  return resources.userResources.media.get(id);
}

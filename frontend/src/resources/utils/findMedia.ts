import { BoundState } from '../store/BoundState';
import { ResultMedia } from '../../model/Media';
import { UUID } from '../../model/Id';

export function findMedia(
  id: UUID,
  resources: BoundState,
): ResultMedia | undefined {
  return resources.userResources.media.get(id);
}

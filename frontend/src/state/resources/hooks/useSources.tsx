import { Source, UUID } from '../../../model/DexterModel';
import { useBoundStore } from '../useBoundStore';
import { findSourceWithChildIds } from '../utils/findSourceWithChildIds';
import { linkSourceChildren } from '../utils/linkSourceChildren';
import { toValueArray } from '../utils/toValueArray';

export function useSources() {
  // const { updateUserResources, sources } = useUserResourcesStore();
  const store = useBoundStore();

  // function getSourceFrom(
  //   draft: ResultUserResources,
  //   sourceId: string,
  // ): ResultSourceWithChildIds {
  //   return draft.sources.find(c => c.id === sourceId);
  // }

  return {
    getSource(sourceId: UUID): Source {
      return linkSourceChildren(findSourceWithChildIds(sourceId, store), store);
    },

    getSources(): Source[] {
      return toValueArray(store.userResources.sources).map(c =>
        linkSourceChildren(c, store),
      );
    },
  };
}

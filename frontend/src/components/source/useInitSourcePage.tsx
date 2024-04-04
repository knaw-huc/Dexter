import { useEffect } from 'react';
import { Source, UUID } from '../../model/DexterModel';
import { getSourceWithResourcesById } from '../../utils/API';
import { useImmer } from 'use-immer';
import { assign } from '../../utils/recipe/assign';
import { DraftSetter } from '../../utils/recipe/Setter';
import { useThrowSync } from '../common/error/useThrowSync';

export function useInitSourcePage(params: {
  sourceId: UUID;
  setSource: DraftSetter<Source>;
}): {
  isInit: boolean;
} {
  const { sourceId, setSource } = params;
  const [isInit, setInit] = useImmer(false);
  const throwSync = useThrowSync();
  useEffect(() => void init(), []);

  async function init() {
    try {
      const update = await getSourceWithResourcesById(sourceId);
      setSource(source => assign(source, update));
      setInit(true);
    } catch (e) {
      throwSync(e);
    }
  }

  return { isInit };
}

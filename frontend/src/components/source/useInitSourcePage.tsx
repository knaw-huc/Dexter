import { useEffect } from 'react';
import { Source, UUID } from '../../model/DexterModel';
import { getSourceWithResourcesById } from '../../utils/API';
import { useImmer } from 'use-immer';
import { assign } from '../../utils/immer/assign';
import { DraftSetter } from '../../utils/immer/Setter';
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
      const source = await getSourceWithResourcesById(sourceId);
      setSource(draft => assign(draft, source));
      setInit(true);
    } catch (e) {
      throwSync(e);
    }
  }

  return { isInit };
}

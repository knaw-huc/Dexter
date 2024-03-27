import { useEffect } from 'react';
import { Corpus, Source, UUID } from '../../model/DexterModel';
import {
  getCorporaWithResources,
  getCorpusWithResourcesById,
  getSourcesWithResources,
} from '../../utils/API';
import { useImmer } from 'use-immer';
import { DraftSetter, Setter } from '../../utils/draft/Setter';
import { useThrowSync } from '../common/error/useThrowSync';
import { remove } from '../../utils/draft/remove';
import { push } from '../../utils/draft/push';

export function useInitCorpusPage(params: {
  corpusId: UUID;
  setCorpus: Setter<Corpus>;
  setSourceOptions: DraftSetter<Source[]>;
  setCorpusOptions: DraftSetter<Corpus[]>;
}): {
  isInit: boolean;
} {
  const { corpusId, setCorpus, setSourceOptions, setCorpusOptions } = params;
  const [isInit, setInit] = useImmer(false);
  const throwSync = useThrowSync();
  useEffect(() => void init(), []);

  async function init() {
    try {
      setCorpus(await getCorpusWithResourcesById(corpusId));
      const sourceOptions = await getSourcesWithResources();
      setSourceOptions(draft => push(draft, ...sourceOptions));
      const corpusOptions = await getCorporaWithResources();
      remove(corpusOptions, corpusId);
      setCorpusOptions(draft => push(draft, ...corpusOptions));
    } catch (e) {
      throwSync(e);
    }
    setInit(true);
  }

  return { isInit };
}

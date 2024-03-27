import { useEffect } from 'react';
import { Corpus, Source, UUID } from '../../model/DexterModel';
import {
  getCorporaWithResources,
  getCorpusWithResourcesById,
  getSourcesWithResources,
} from '../../utils/API';
import { useImmer } from 'use-immer';
import { Setter } from '../../utils/immer/Setter';
import { useThrowSync } from '../common/error/useThrowSync';
import { remove } from '../../utils/immer/remove';

export function useInitCorpusPage(params: {
  corpusId: UUID;
  setCorpus: Setter<Corpus>;
  setSourceOptions: Setter<Source[]>;
  setCorpusOptions: Setter<Corpus[]>;
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
      setSourceOptions(await getSourcesWithResources());
      const corpusOptions = await getCorporaWithResources();
      remove(corpusOptions, corpusId);
      setCorpusOptions(corpusOptions);
    } catch (e) {
      throwSync(e);
    }
    setInit(true);
  }

  return { isInit };
}

import { useEffect } from 'react';
import { Corpus, Source, UUID } from '../../model/DexterModel';
import {
  getCorporaWithResources,
  getCorpusWithResourcesById,
  getSourcesWithResources,
} from '../../utils/API';
import { useImmer } from 'use-immer';
import { Setter } from '../../utils/recipe/Setter';
import { useThrowSync } from '../common/error/useThrowSync';

export function useInitCorpusPage(params: {
  corpusId: UUID;
  setCorpus: Setter<Corpus>;
  setAllSources: Setter<Source[]>;
  setAllCorpora: Setter<Corpus[]>;
}): {
  isInit: boolean;
} {
  const { corpusId, setCorpus, setAllSources, setAllCorpora } = params;
  const [isInit, setInit] = useImmer(false);
  const throwSync = useThrowSync();
  useEffect(() => void init(), []);

  async function init() {
    try {
      setCorpus(await getCorpusWithResourcesById(corpusId));
      setAllSources(await getSourcesWithResources());
      setAllCorpora(await getCorporaWithResources());
    } catch (e) {
      throwSync(e);
    }
    setInit(true);
  }

  return { isInit };
}

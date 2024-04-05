import { useBoundStore } from './useBoundStore';

export const useCorpusPageStore = () =>
  useBoundStore(state => state.corpusPage);

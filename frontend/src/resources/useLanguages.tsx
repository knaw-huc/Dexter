import { getValidated, postValidated } from '../utils/API';
import { useBoundStore } from './store/useBoundStore';
import { toValueArray } from './utils/toValueArray';
import { ResultLanguage } from '../model/Language';

export function useLanguages() {
  const { languages } = useBoundStore();

  const getLanguages = (): ResultLanguage[] => {
    return toValueArray(languages.languages);
  };

  const getLanguagesAutocomplete = async (
    input: string,
  ): Promise<ResultLanguage[]> => {
    return postValidated(`/api/languages/autocomplete`, input);
  };

  const initLanguages = async () => {
    await getValidated(`/api/languages`)
      .then(l => {
        languages.setLanguages(l);
        languages.setLoading(false);
      })
      .catch(languages.setError);
  };

  return {
    initLanguages,
    getLanguages,
    getLanguagesAutocomplete,
  };
}

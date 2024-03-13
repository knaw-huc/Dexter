import { ResultCitation, SubmitFormCitation } from '../../model/DexterModel';
import { formatCitation } from './formatCitation';
import { CitationStyle } from './CitationStyle';
import { ErrorWithMessage } from '../common/error/ErrorWithMessage';
import { createTerms } from './createTerms';

type Params = {
  /**
   * Update citation with new formatted citation
   */
  setCitation: (formatted: SubmitFormCitation) => void;

  /**
   * Error status of last formatting
   */
  onError?: (e: ErrorWithMessage | null) => void;
};

type Result = {
  load: (toFormat: Omit<ResultCitation, 'id'>, style: CitationStyle) => void;
};

/**
 * Generate formatted citation and search terms
 */
export function useFormattedCitation(params: Params): Result {
  const { setCitation, onError } = params;

  function handleError(e: Error) {
    if (onError) {
      onError(e);
    } else if (e?.message) {
      console.debug(`Could not format citation: ${e?.message}`, e);
    }
  }

  async function load(toLoad: SubmitFormCitation, style: CitationStyle) {
    if (!toLoad.input) {
      setCitation({ ...toLoad, isLoading: false, formatted: '' });
      return;
    }
    const loading = { ...toLoad, isLoading: true, formatted: '' };
    setCitation(loading);

    const formatted = { ...loading };
    try {
      formatted.formatted = await formatCitation(toLoad.input, style);
      formatted.terms = await createTerms(toLoad.input);
      handleError(null);
    } catch (e) {
      formatted.formatted = '';
      formatted.terms = '';
      handleError(new Error(`Could not format citation input: ${e.message}`));
    }
    formatted.isLoading = false;
    setCitation(formatted);
  }

  return { load };
}

import { Citation, ResultCitation } from '../../model/DexterModel';
import { formatCitation } from './formatCitation';
import { CitationStyle } from './CitationStyle';
import { ErrorWithMessage } from '../common/error/ErrorWithMessage';
import { createTerms } from './createTerms';

type Params = {
  /**
   * Update citation with new formatted citation
   */
  setCitation: (formatted: Citation) => void;

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
    } else {
      console.debug(`Could not format citation: ${e.message}`);
    }
  }

  async function load(toLoad: Citation, style: CitationStyle) {
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

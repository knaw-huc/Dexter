import { Citation, SubmitFormCitation } from '../../model/DexterModel';
import { formatCitation } from './formatCitation';
import { CitationStyle } from './CitationStyle';
import { ErrorWithMessage } from '../common/error/ErrorWithMessage';
import { createTerms } from './createTerms';

type Params = {
  /**
   * Update citation with new formatted citation
   */
  onLoaded: (unformatted: Citation) => void;

  /**
   * Error status of last formatting
   */
  onError: (e: ErrorWithMessage | null) => void;
};

type Result = {
  load: (toFormat: SubmitFormCitation, style: CitationStyle) => void;
};

/**
 * Generate formatted citation and search terms
 */
export function useLoadCitation(params: Params): Result {
  const { onLoaded, onError } = params;

  async function load(toLoad: Citation, style: CitationStyle) {
    if (!toLoad.input) {
      onLoaded({ ...toLoad, formatted: '' });
      return;
    }
    const loading = { ...toLoad, isLoading: true, formatted: '' };
    onLoaded(loading);

    const formatted = { ...loading };
    try {
      formatted.formatted = await formatCitation(toLoad.input, style);
      formatted.terms = await createTerms(toLoad.input);
      onError(null);
    } catch (e) {
      formatted.formatted = '';
      formatted.terms = '';
      onError(new Error('Could not format citation input', e));
    }
    formatted.isLoading = false;
    onLoaded(formatted);
  }

  return { load };
}

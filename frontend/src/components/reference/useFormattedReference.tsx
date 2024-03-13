import { ResultReference, SubmitFormReference } from '../../model/DexterModel';
import { formatReference } from './formatReference';
import { ReferenceStyle } from './ReferenceStyle';
import { ErrorWithMessage } from '../common/error/ErrorWithMessage';
import { createTerms } from './createTerms';

type Params = {
  /**
   * Update reference with new formatted reference
   */
  setReference: (formatted: SubmitFormReference) => void;

  /**
   * Error status of last formatting
   */
  onError?: (e: ErrorWithMessage | null) => void;
};

type Result = {
  load: (toFormat: Omit<ResultReference, 'id'>, style: ReferenceStyle) => void;
};

/**
 * Generate formatted reference and search terms
 */
export function useFormattedReference(params: Params): Result {
  const { setReference, onError } = params;

  function handleError(e: Error) {
    if (onError) {
      onError(e);
    } else if (e?.message) {
      console.debug(`Could not format reference: ${e?.message}`, e);
    }
  }

  async function load(toLoad: SubmitFormReference, style: ReferenceStyle) {
    if (!toLoad.input) {
      setReference({ ...toLoad, isLoading: false, formatted: '' });
      return;
    }
    const loading = { ...toLoad, isLoading: true, formatted: '' };
    setReference(loading);

    const formatted = { ...loading };
    try {
      formatted.formatted = await formatReference(toLoad.input, style);
      formatted.terms = await createTerms(toLoad.input);
      handleError(null);
    } catch (e) {
      formatted.formatted = '';
      formatted.terms = '';
      handleError(new Error(`Could not format reference input: ${e.message}`));
    }
    formatted.isLoading = false;
    setReference(formatted);
  }

  return { load };
}

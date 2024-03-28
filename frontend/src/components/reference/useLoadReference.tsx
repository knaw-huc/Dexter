import { ResultReference, SubmitFormReference } from '../../model/DexterModel';
import { ReferenceStyle } from './ReferenceStyle';
import { ErrorWithMessage } from '../common/error/ErrorWithMessage';
import { createTerms } from './createTerms';
import { createCsl } from './createCsl';
import { truncateInput } from './truncateInput';

type Params = {
  /**
   * Function to call once the new reference has been loaded
   */
  onLoaded: (loaded: SubmitFormReference) => void;

  /**
   * Error status of last formatting
   */
  onError?: (e: ErrorWithMessage | null) => void;
};

type Result = {
  load: (
    toFormat: Omit<ResultReference, 'id'>,
    style: ReferenceStyle,
  ) => Promise<void>;
};

/**
 * Generate csl and search terms
 */
export function useLoadReference(params: Params): Result {
  const { onLoaded, onError } = params;

  function handleError(e: Error, toLoad?: SubmitFormReference) {
    if (onError) {
      onError(e);
    } else if (e?.message) {
      console.debug(
        `Could not format reference: ${e?.message}\ninput:  ${toLoad.input}`,
        e,
      );
    }
  }

  async function load(toLoad: SubmitFormReference) {
    if (!toLoad.input) {
      onLoaded({ ...toLoad, csl: '' });
      return;
    }
    const result: SubmitFormReference = { ...toLoad };
    try {
      result.csl = await createCsl(toLoad.input);
      result.terms = createTerms(result.csl) || truncateInput(result.input);
      handleError(null);
    } catch (e) {
      result.csl = '';
      result.terms = truncateInput(result.input);
      handleError(e, toLoad);
    }
    onLoaded(result);
  }

  return { load };
}

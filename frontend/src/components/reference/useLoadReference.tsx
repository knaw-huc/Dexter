import {
  FormReference,
  ResultReference,
  SubmitFormReference,
} from '../../model/DexterModel';
import { ReferenceStyle } from './ReferenceStyle';
import { ErrorWithMessage } from '../common/error/ErrorWithMessage';
import { createTerms } from './createTerms';
import { createCsl } from './createCsl';
import _ from 'lodash';
import { normalize } from '../../utils/normalize';

type Params = {
  /**
   * Function to call once the new reference has been loaded
   */
  onLoaded: (formatted: SubmitFormReference) => void;

  /**
   * Error status of last formatting
   */
  onError?: (e: ErrorWithMessage | null) => void;
};

type Result = {
  load: (toFormat: Omit<ResultReference, 'id'>, style: ReferenceStyle) => void;
};

function truncateInput(
  result: FormReference,
  inputSearchTermLength: number = 70,
) {
  return normalize(
    _.truncate(result.input, {
      length: inputSearchTermLength,
    }),
  );
}

/**
 * Generate csl and search terms
 */
export function useLoadReference(params: Params): Result {
  const { onLoaded, onError } = params;

  function handleError(e: Error) {
    if (onError) {
      onError(e);
    } else if (e?.message) {
      console.debug(`Could not format reference: ${e?.message}`, e);
    }
  }

  async function load(toLoad: SubmitFormReference) {
    if (!toLoad.input) {
      onLoaded({ ...toLoad, isLoading: false, csl: '' });
      return;
    }
    const loading = { ...toLoad, isLoading: true, csl: '' };
    onLoaded(loading);

    const result: SubmitFormReference = { ...loading };
    try {
      result.csl = await createCsl(toLoad.input);
      result.terms = createTerms(result.csl) || truncateInput(result);
      handleError(null);
    } catch (e) {
      result.csl = '';
      result.terms = truncateInput(result);
      handleError(new Error(`Could not format reference input: ${e.message}`));
    }
    result.isLoading = false;
    onLoaded(result);
  }

  return { load };
}

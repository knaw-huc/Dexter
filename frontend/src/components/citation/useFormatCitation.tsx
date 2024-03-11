import { Citation, SubmitFormCitation } from '../../model/DexterModel';
import { formatCitation } from './formatCitation';
import { CitationStyle } from './CitationStyle';
import { ErrorWithMessage } from '../common/error/ErrorWithMessage';

type UseSubmitCorpusFormParams = {
  /**
   * Update citation with new formatted citation
   */
  onFormatted: (unformatted: Citation) => void;

  /**
   * Error status of last formatting
   */
  onError: (e: ErrorWithMessage | null) => void;
};

type UseSubmitCorpusFormResult = {
  format: (toFormat: SubmitFormCitation, style: CitationStyle) => void;
};

export function useFormatCitation(
  params: UseSubmitCorpusFormParams,
): UseSubmitCorpusFormResult {
  const { onFormatted, onError } = params;

  async function format(toFormat: Citation, style: CitationStyle) {
    const loading = { ...toFormat, isLoading: true, formatted: '' };
    onFormatted(loading);
    const formatted = { ...loading };
    try {
      formatted.formatted = await formatCitation(toFormat.input, style);
      onError(null);
    } catch (e) {
      formatted.formatted = '';
      onError(new Error('Could not format citation input', e));
    }
    formatted.isLoading = false;
    onFormatted(formatted);
  }

  return { format };
}

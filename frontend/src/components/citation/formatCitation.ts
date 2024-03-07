import Cite from 'citation-js';
import { CitationStyle } from './CitationStyle';

export async function formatCitation(
  data: string,
  style: CitationStyle,
): Promise<string> {
  const cite = await Cite.async(data);
  console.log('formatCitation', { cite });
  return cite.format('bibliography', {
    format: 'html',
    template: style,
    lang: 'en-US',
  });
}

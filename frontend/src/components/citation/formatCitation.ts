import Cite from 'citation-js';
import { CitationStyle } from './CitationStyle';
import { CitationFormat } from './CitationFormat';

initCitationStyle('chicago', 'chicago-note-bibliography');

export async function formatCitation(
  citationJsData: string,
  style: CitationStyle,
  format: CitationFormat = CitationFormat.bibliography,
): Promise<string> {
  const cite = await Cite.async(citationJsData);
  return cite.format(format, {
    format: 'html',
    template: style,
    lang: 'en-US',
  });
}

/**
 * Source: https://github.com/larsgw/citation.js/issues/204#issuecomment-699048488
 */
function initCitationStyle(styleName: string, zoteroStyleName: string) {
  const styleConfig = Cite.plugins.config.get('@csl');

  const styleData = Cite.util.fetchFile(
    'https://zotero.org/styles/' + zoteroStyleName,
  );
  styleConfig.templates.add(styleName, styleData);
}

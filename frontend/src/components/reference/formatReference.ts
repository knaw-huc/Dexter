import Cite from 'citation-js';
import { ReferenceStyle } from './ReferenceStyle';
import { ReferenceType } from './ReferenceType';
import { ReferenceFormat } from './ReferenceFormat';
import { getAssetValidated } from '../../utils/API';

const init = initReferenceStyle('chicago', 'chicago-note-bibliography.xml');

export async function formatReferenceAsync(
  citationJsData: string,
  style: ReferenceStyle,
  type: ReferenceType = ReferenceType.bibliography,
  format: ReferenceFormat = ReferenceFormat.html,
): Promise<string> {
  await init;
  const cite = await Cite.async(citationJsData);
  return cite.format(type, {
    format: format,
    template: style,
    lang: 'en-US',
  }) as string;
}

export function formatReference(
  citationJsData: string,
  style: ReferenceStyle,
  type: ReferenceType = ReferenceType.bibliography,
  format: ReferenceFormat = ReferenceFormat.html,
): string {
  const cite = new Cite(citationJsData);
  return cite.format(type, {
    format: format,
    template: style,
    lang: 'en-US',
  }) as string;
}

/**
 * Source: https://github.com/larsgw/citation.js/issues/204#issuecomment-699048488
 */
async function initReferenceStyle(styleName: string, cslFilename: string) {
  const styleConfig = Cite.plugins.config.get('@csl');
  const response = await getAssetValidated(cslFilename);
  const csl = await response.text();
  styleConfig.templates.add(styleName, csl);
}

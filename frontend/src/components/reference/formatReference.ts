import Cite from 'citation-js';
import { ReferenceStyle } from './ReferenceStyle';
import { ReferenceFormat } from './ReferenceFormat';
import { api, assets } from '../../model/Resources';

const init = initReferenceStyle('chicago', 'chicago-note-bibliography.xml');

export async function formatReference(
  citationJsData: string,
  style: ReferenceStyle,
  format: ReferenceFormat = ReferenceFormat.bibliography,
): Promise<string> {
  await init;
  const cite = await Cite.async(citationJsData);
  return cite.format(format, {
    format: 'html',
    template: style,
    lang: 'en-US',
  }) as string;
}

/**
 * Source: https://github.com/larsgw/reference.js/issues/204#issuecomment-699048488
 */
async function initReferenceStyle(styleName: string, cslFilename: string) {
  const styleConfig = Cite.plugins.config.get('@csl');
  const response = await fetch(
    `${window.location.origin}/${api}/${assets}/${cslFilename}`,
  );
  const csl = await response.text();
  styleConfig.templates.add(styleName, csl);
}

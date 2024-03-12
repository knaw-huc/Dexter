import Cite from 'citation-js';

export async function createBibtex(citationJsData: string) {
  const cite = await Cite.async(citationJsData);
  return cite.format('bibtex');
}

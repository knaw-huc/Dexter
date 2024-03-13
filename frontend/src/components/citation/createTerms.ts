import Cite from 'citation-js';
import { CslJson } from './CslJson';
import { normalize } from '../../utils/normalize';

export async function createTerms(citationJsData: string) {
  let csl: CslJson;
  try {
    const cite = await Cite.async(citationJsData);
    csl = cite.format('data', { format: 'object' }) as CslJson;
  } catch (e) {
    return normalize(citationJsData.substring(0, 100));
  }
  const authors = csl[0].author.map(a => a.family).join(' ');
  const year = csl[0].issued['date-parts'][0][0];
  const title = csl[0].title;
  return normalize(`${authors} ${year} ${title}`);
}
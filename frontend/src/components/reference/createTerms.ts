import { normalize } from '../../utils/normalize';
import { CslJson } from './CslJson';

export function createTerms(csl: string): string | undefined {
  let parsed: CslJson;
  try {
    parsed = JSON.parse(csl);
  } catch (e) {
    console.log('Could not parse csl: ' + csl);
    return;
  }
  const authors = parsed[0].author
    .map((a: { family: string }) => a.family)
    .join(' ');
  const year = parsed[0].issued['date-parts'][0][0];
  const title = parsed[0].title;
  return normalize(`${authors} ${year} ${title}`);
}

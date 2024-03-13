import Cite from 'citation-js';
import { CslJson } from './CslJson';

export async function createCsl(referenceJsData: string): Promise<string> {
  const parsed: Cite = await Cite.async(referenceJsData);
  const csl = parsed.format('data', { format: 'object' }) as CslJson;
  csl.forEach(e => delete e.id);
  return JSON.stringify(csl);
}

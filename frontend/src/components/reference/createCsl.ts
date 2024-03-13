import Cite from 'citation-js';

export async function createCsl(referenceJsData: string): Promise<string> {
  const parsed: Cite = await Cite.async(referenceJsData);
  const csl = parsed.format('data', { format: 'object' });
  return JSON.stringify(csl);
}

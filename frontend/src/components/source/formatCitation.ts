import Cite from 'citation-js';

export async function formatCitation(data: string): Promise<string> {
  const cite = await Cite.async(data);
  return cite.format('bibliography', {
    format: 'html',
    template: 'citation-apa',
    lang: 'en-US',
  });
}

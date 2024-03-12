import { describe, expect, test } from '@jest/globals';
import { formatCitation } from './formatCitation';
import { CitationStyle } from './CitationStyle';
import { CitationFormat } from './CitationFormat';

describe('formatCitation', () => {
  const citationStyle = CitationStyle.apa;
  const doi = 'https://doi.org/10.1145/3343413.3377969';

  test('creates bibliography from doi in apa style', async () => {
    const actual = await formatCitation(doi, citationStyle);
    const expected =
      'Koolen, M., Kumpulainen, S., &#38; Melgar-Estrada, L. (2020, March 14). A Workflow Analysis Perspective to Scholarly Research Tasks. <i>Proceedings of the 2020 Conference on Human Information Interaction and Retrieval</i>. CHIIR ’20: Conference on Human Information Interaction and Retrieval. https://doi.org/10.1145/3343413.3377969';
    expect(actual).toContain(expected);
  });

  test('creates bibliography from doi in vancouver style', async () => {
    const actual = await formatCitation(doi, CitationStyle.vancouver);
    const expected =
      'Koolen M, Kumpulainen S, Melgar-Estrada L. A Workflow Analysis Perspective to Scholarly Research Tasks. In: Proceedings of the 2020 Conference on Human Information Interaction and Retrieval [Internet]. ACM; 2020. Available from: http://dx.doi.org/10.1145/3343413.3377969';
    expect(actual).toContain(expected);
  });

  test('creates bibliography from doi in chicago style', async () => {
    const actual = await formatCitation(
      'https://doi.org/10.1111/acel.12050',
      CitationStyle.vancouver,
    );
    const expected =
      'Boonekamp, Jelle J., Mirre J. P. Simons, Lia Hemerik, and Simon Verhulst. “Telomere Length Behaves as Biomarker of Somatic Redundancy Rather than Biological Age.” <i>Aging Cell</i> 12, no. 2 (February 22, 2013): 330–32. https://doi.org/10.1111/acel.12050.';
    expect(actual).toContain(expected);
  });

  const bibtex =
    '@article{boonekamp2013telomere,\n' +
    '  title={Telomere length behaves as biomarker of somatic redundancy rather than biological age},\n' +
    '  author={Boonekamp, Jelle J and Simons, Mirre JP and Hemerik, Lia and Verhulst, Simon},\n' +
    '  journal={Aging cell},\n' +
    '  volume={12},\n' +
    '  number={2},\n' +
    '  pages={330--332},\n' +
    '  year={2013},\n' +
    '  publisher={Wiley Online Library}\n' +
    '}\n';

  test('creates citation from bibtex in apa style', async () => {
    const actual = await formatCitation(
      bibtex,
      citationStyle,
      CitationFormat.citation,
    );
    const expected = '(Boonekamp et al., 2013)';
    expect(actual).toContain(expected);
  });
});

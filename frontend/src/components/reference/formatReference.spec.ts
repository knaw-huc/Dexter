import { describe, expect, it } from '@jest/globals';
import { formatReferenceSync, formatReference } from './formatReference';
import { ReferenceStyle } from './ReferenceStyle';
import { ReferenceFormat } from './ReferenceFormat';

describe('formatReference', () => {
  const referenceStyle = ReferenceStyle.apa;
  const doi = 'https://doi.org/10.1145/3343413.3377969';

  it('creates bibliography from doi in apa style', async () => {
    const actual = await formatReference(doi, referenceStyle);
    const expected =
      'Koolen, M., Kumpulainen, S., &#38; Melgar-Estrada, L. (2020, March 14). A Workflow Analysis Perspective to Scholarly Research Tasks. <i>Proceedings of the 2020 Conference on Human Information Interaction and Retrieval</i>. CHIIR ’20: Conference on Human Information Interaction and Retrieval. https://doi.org/10.1145/3343413.3377969';
    expect(actual).toContain(expected);
  });

  it('creates bibliography from doi in vancouver style', async () => {
    const actual = await formatReference(doi, ReferenceStyle.vancouver);
    const expected =
      'Koolen M, Kumpulainen S, Melgar-Estrada L. A Workflow Analysis Perspective to Scholarly Research Tasks. In: Proceedings of the 2020 Conference on Human Information Interaction and Retrieval [Internet]. ACM; 2020. Available from: http://dx.doi.org/10.1145/3343413.3377969';
    expect(actual).toContain(expected);
  });

  it('creates bibliography from doi in chicago style', async () => {
    const actual = await formatReference(
      'https://doi.org/10.1111/acel.12050',
      ReferenceStyle.chicago,
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

  it('creates reference from bibtex in apa style', async () => {
    const actual = await formatReference(
      bibtex,
      referenceStyle,
      ReferenceFormat.citation,
    );
    const expected = '(Boonekamp et al., 2013)';
    expect(actual).toContain(expected);
  });

  it('creates bibliography in chicago style from csl', async () => {
    const csl =
      '[{"publisher":"ACM","DOI":"10.1145/3343413.3377969","type":"paper-conference","source":"Crossref","title":"A Workflow Analysis Perspective to Scholarly Research Tasks","author":[{"given":"Marijn","family":"Koolen","sequence":"first","affiliation":[{"name":"Royal Netherlands Academy of Arts and Sciences, Amsterdam, Netherlands"}]},{"given":"Sanna","family":"Kumpulainen","sequence":"additional","affiliation":[{"name":"Tampere University, Tampere, Finland"}]},{"given":"Liliana","family":"Melgar-Estrada","sequence":"additional","affiliation":[{"name":"Utrecht University &amp; The Netherlands Institute for Sound and Vision, Utrecht, Netherlands"}]}],"container-title":"Proceedings of the 2020 Conference on Human Information Interaction and Retrieval","issued":{"date-parts":[[2020,3,14]]},"URL":"http://dx.doi.org/10.1145/3343413.3377969","event-title":"CHIIR \'20: Conference on Human Information Interaction and Retrieval","id":"temp_id_7823174222091251"}]';

    const actual = await formatReference(csl, ReferenceStyle.chicago);
    const expected =
      'Koolen, Marijn, Sanna Kumpulainen, and Liliana Melgar-Estrada. “A Workflow Analysis Perspective to Scholarly Research Tasks.” In <i>Proceedings of the 2020 Conference on Human Information Interaction and Retrieval';
    expect(actual).toContain(expected);
  });
});

describe('formatReferenceSync', () => {
  it('creates citation from csl synchronously', () => {
    const start = performance.now();
    const csl =
      '[{"publisher":"ACM","DOI":"10.1145/3343413.3377969","type":"paper-conference","source":"Crossref","title":"A Workflow Analysis Perspective to Scholarly Research Tasks","author":[{"given":"Marijn","family":"Koolen","sequence":"first","affiliation":[{"name":"Royal Netherlands Academy of Arts and Sciences, Amsterdam, Netherlands"}]},{"given":"Sanna","family":"Kumpulainen","sequence":"additional","affiliation":[{"name":"Tampere University, Tampere, Finland"}]},{"given":"Liliana","family":"Melgar-Estrada","sequence":"additional","affiliation":[{"name":"Utrecht University &amp; The Netherlands Institute for Sound and Vision, Utrecht, Netherlands"}]}],"container-title":"Proceedings of the 2020 Conference on Human Information Interaction and Retrieval","issued":{"date-parts":[[2020,3,14]]},"URL":"http://dx.doi.org/10.1145/3343413.3377969","event-title":"CHIIR \'20: Conference on Human Information Interaction and Retrieval","id":"temp_id_7823174222091251"}]';

    const actual = formatReferenceSync(
      csl,
      ReferenceStyle.apa,
      ReferenceFormat.citation,
    );
    const expected = '(Koolen et al., 2020)';
    expect(actual).toContain(expected);
    console.timeLog('Formatted citation from csl');
    console.log(
      `formatting of citation using csl took ${(
        performance.now() - start
      ).toFixed(2)}ms`,
    );
  });
});

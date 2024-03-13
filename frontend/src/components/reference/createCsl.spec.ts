import { describe, expect, it } from '@jest/globals';
import { createCsl } from './createCsl';
import { formatReference } from './formatReference';
import { ReferenceStyle } from './ReferenceStyle';

describe('createCsl', () => {
  it('creates bibtex from doi', async () => {
    const doi = 'https://doi.org/10.1145/3343413.3377969';
    const expected =
      '[{"publisher":"ACM","DOI":"10.1145/3343413.3377969","type":"paper-conference","source":"Crossref","title":"A Workflow Analysis Perspective to Scholarly Research Tasks","author":[{"given":"Marijn","family":"Koolen","sequence":"first","affiliation":[{"name":"Royal Netherlands Academy of Arts and Sciences, Amsterdam, Netherlands"}]},{"given":"Sanna","family":"Kumpulainen","sequence":"additional","affiliation":[{"name":"Tampere University, Tampere, Finland"}]},{"given":"Liliana","family":"Melgar-Estrada","sequence":"additional","affiliation":[{"name":"Utrecht University &amp; The Netherlands Institute for Sound and Vision, Utrecht, Netherlands"}]}],"container-title":"Proceedings of the 2020 Conference on Human Information Interaction and Retrieval","issued":{"date-parts":[[2020,3,14]]},"URL":"http://dx.doi.org/10.1145/3343413.3377969","event-title":"CHIIR \'20: Conference on Human Information Interaction and Retrieval"}]';
    const actual = await createCsl(doi);
    expect(actual).toEqual(expected);
  });

  it('creates bibtex that can create apa citation', async () => {
    const doi = 'https://doi.org/10.1145/3343413.3377969';
    const csl = await createCsl(doi);
    const actual = formatReference(csl, ReferenceStyle.apa);
    const expected =
      'Koolen, M., Kumpulainen, S., &#38; Melgar-Estrada, L. (2020, March 14). A Workflow Analysis Perspective to Scholarly Research Tasks. <i>Proceedings of the 2020 Conference on Human Information Interaction and Retrieval</i>. CHIIR ’20: Conference on Human Information Interaction and Retrieval. https://doi.org/10.1145/3343413.3377969';
    expect(actual).toContain(expected);
  });
});

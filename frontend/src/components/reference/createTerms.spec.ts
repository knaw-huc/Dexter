import { describe, expect, it } from '@jest/globals';
import { createTerms } from './createTerms';

describe('createBibtex', () => {
  const terms =
    'koolen kumpulainen melgar-estrada 2020 a workflow analysis perspective to scholarly research tasks';

  it('returns undefined when illegal format', async () => {
    const actual = createTerms(
      'Dat ene boek met over Volkskunst door Jansen of wat was het? En dan nu nog eens heel veel tekst die de limiet overschrijdt.',
    );
    expect(actual).toEqual(undefined);
  });

  it('creates terms from csl', async () => {
    const csl =
      '[{"publisher":"ACM","DOI":"10.1145/3343413.3377969","type":"paper-conference","source":"Crossref","title":"A Workflow Analysis Perspective to Scholarly Research Tasks","author":[{"given":"Marijn","family":"Koolen","sequence":"first","affiliation":[{"name":"Royal Netherlands Academy of Arts and Sciences, Amsterdam, Netherlands"}]},{"given":"Sanna","family":"Kumpulainen","sequence":"additional","affiliation":[{"name":"Tampere University, Tampere, Finland"}]},{"given":"Liliana","family":"Melgar-Estrada","sequence":"additional","affiliation":[{"name":"Utrecht University &amp; The Netherlands Institute for Sound and Vision, Utrecht, Netherlands"}]}],"container-title":"Proceedings of the 2020 Conference on Human Information Interaction and Retrieval","issued":{"date-parts":[[2020,3,14]]},"URL":"http://dx.doi.org/10.1145/3343413.3377969","event-title":"CHIIR \'20: Conference on Human Information Interaction and Retrieval","id":"temp_id_7823174222091251"}]';
    const actual = createTerms(csl);
    expect(actual).toEqual(terms);
  });
});

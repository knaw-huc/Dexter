import { describe, expect, it } from '@jest/globals';
import { createTerms } from './createTerms';

describe('createBibtex', () => {
  const doi = 'https://doi.org/10.1145/3343413.3377969';

  it('creates terms from doi', async () => {
    const actual = await createTerms(doi);
    const expected =
      'koolen kumpulainen melgar-estrada 2020 a workflow analysis perspective to scholarly research tasks';
    expect(actual).toEqual(expected);
  });

  it('does a substring when illegal format', async () => {
    const actual = await createTerms(
      'Dat ene boek met over Volkskunst door Jansen of wat was het? En dan nu nog eens heel veel tekst die de limiet overschrijdt.',
    );
    const expected =
      'dat ene boek met over volkskunst door jansen of wat was het? en dan nu nog eens heel veel tekst die ';
    expect(actual).toEqual(expected);
  });
});

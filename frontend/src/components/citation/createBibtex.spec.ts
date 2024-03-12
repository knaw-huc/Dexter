import { describe, expect, test } from '@jest/globals';
import { createBibtex } from './createBibtex';

describe('createBibtex', () => {
  const doi = 'https://doi.org/10.1145/3343413.3377969';

  test('creates bibtex from doi', async () => {
    const actual = await createBibtex(doi);
    const expected =
      '@inproceedings{Koolen2020Workflow,\n' +
      '\tauthor = {Koolen, Marijn and Kumpulainen, Sanna and Melgar-Estrada, Liliana},\n' +
      '\tbooktitle = {Proceedings of the 2020 {Conference} on {Human} {Information} {Interaction} and {Retrieval}},\n' +
      '\tdoi = {10.1145/3343413.3377969},\n' +
      '\tyear = {2020},\n' +
      '\tmonth = {mar 14},\n' +
      '\torganization = {ACM},\n' +
      '\ttitle = {A {Workflow} {Analysis} {Perspective} to {Scholarly} {Research} {Tasks}},\n' +
      '\turl = {http://dx.doi.org/10.1145/3343413.3377969},\n' +
      '}\n\n';
    expect(actual).toEqual(expected);
  });
});

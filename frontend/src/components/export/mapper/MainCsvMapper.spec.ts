import { describe, expect, it } from '@jest/globals';
import { MainMapper } from './MainMapper';
import { Corpus } from '../../../model/DexterModel';
import corpus from '../../../test/resources/corpus.json';
import corpusWithEmptyValues from '../../../test/resources/corpusWithEmptyValues.json';
import { ReferenceStyle } from '../../reference/ReferenceStyle';
import { ArrayTable } from './Table';

describe('MainCsvMapper', () => {
  const customMetadataKeys = ['my custom field', 'other field'];
  const apa = ReferenceStyle.apa;
  it('can map corpus', async () => {
    const toTest = new MainMapper(customMetadataKeys, apa);
    const result = toTest.map(getTestCorpus());
    expect(result.length).toBe(4);

    const expected = getExpectedCorpus();
    const actual = result[0].toCsvTable();
    expect(actual).toEqual(expected);

    const tableNames = result.map(t => t.name);
    tableNames.sort();
    expect(tableNames).toEqual(['corpora', 'media', 'references', 'sources']);
  });

  it('can map corpus sources', async () => {
    const toTest = new MainMapper(customMetadataKeys, apa);
    const tables = toTest.map(getTestCorpus());
    const expected = getExpectedCorpusSources();
    const sourcesTable = tables.find(t => t.name === 'sources');
    expect(sourcesTable).toBeTruthy();
    const csvSourcesTable = sourcesTable.toCsvTable();
    expect(sourcesTable.name).toEqual('sources');
    const headerAnd6Sources = 7;
    expect(csvSourcesTable.length).toEqual(headerAnd6Sources);
    expect(csvSourcesTable[0]).toEqual(expected[0]);
    expect(csvSourcesTable[1]).toEqual(expected[1]);
  });

  it('contains the same source twice if assigned to two corpora', async () => {
    const toTest = new MainMapper(customMetadataKeys, apa);
    const tables = toTest.map(getTestCorpus());
    const sourcesTable = tables.find(t => t.name === 'sources');
    expect(sourcesTable).toBeTruthy();
    const csvSourcesTable = sourcesTable.toCsvTable();
    expect(sourcesTable.name).toEqual('sources');
    const source778 = csvSourcesTable.filter(row =>
      row.includes('7787a679-ed53-4bd3-8535-e8ed1c740e68'),
    );
    expect(source778.length).toEqual(2);
    const corporaWithSource778 = [
      '29795f78-9fb3-4693-97ab-bf9c4c7ef05c',
      '29795f78-9fb3-4693-97ab-bf9c4c7ef05c',
    ];
    const sourceRowForEveryCorpus = source778.every(row =>
      corporaWithSource778.find(corpus => row.includes(corpus)),
    );
    expect(sourceRowForEveryCorpus).toBe(true);
  });

  it('can map corpus source media', async () => {
    const toTest = new MainMapper(customMetadataKeys, apa);
    const tables = toTest.map(getTestCorpus());
    const expected = getExpectedCorpusSourcesMedia();
    const mediaTable = tables.find(t => t.name === 'media');
    expect(mediaTable).toBeTruthy();
    const csvMediaTable = mediaTable.toCsvTable();
    expect(mediaTable.name).toEqual('media');
    expect(mediaTable.rows.length).toEqual(18);
    expect(csvMediaTable[0]).toEqual(expected[0]);
    expect(csvMediaTable[1]).toEqual(expected[1]);
  });

  it('can map corpus with null values and empty strings', async () => {
    const toTest = new MainMapper(customMetadataKeys, apa);
    const result = toTest.map(corpusWithEmptyValues);
    expect(result.length).toBe(3);
  });

  it('can map corpus source references', async () => {
    const toTest = new MainMapper(customMetadataKeys, apa);
    const tables = toTest.map(getTestCorpus());
    const expected = getExpectedCorpusSourcesReferences();
    const referenceTable = tables.find(t => t.name === 'references');
    expect(referenceTable).toBeTruthy();
    const csvReferencesTable = referenceTable.toCsvTable();
    expect(referenceTable.rows.length).toEqual(5);
    expect(csvReferencesTable[0]).toEqual(expected[0]);
    expect(csvReferencesTable[1]).toEqual(expected[1]);
  });
});

function getExpectedCorpus() {
  return [
    [
      'id',
      'title',
      'description',
      'rights',
      'access',
      'location',
      'earliest',
      'latest',
      'contributor',
      'notes',
      'ethics',
      'createdAt',
      'updatedAt',
      'parent_id',
      'parent_title',
      'tags',
      'languages',
      'metadata.my custom field',
      'metadata.other field',
    ],
    [
      '29795f78-9fb3-4693-97ab-bf9c4c7ef05c',
      'Main Corpus laoreet',
      'Prulla vitae dolor non urna scelerisque volutpat.',
      'proin',
      'Open',
      'bibendum',
      '1990-01-30',
      '1990-01-31',
      'venenatis',
      'Aenean rutrum erat venenatis, rhoncus lectus a, rutrum eros.',
      'vestibulum dictum amet',
      '2024-03-19T14:15:49',
      '2024-03-19T14:15:49',
      '089770f3-b5e4-4b28-bc2b-4419e57f0941',
      'Main corpus2',
      'foo,bar,poi',
      'English,Latin',
      'gemapt',
      'ook gemapt',
    ],
    [
      '29795f78-9fb3-4693-97ab-bf9c4c7ef05c',
      'Corpus laoreet',
      'Nulla vitae dolor non urna scelerisque volutpat.',
      'proin',
      'Open',
      'bibendum',
      '1990-01-30',
      '1990-01-31',
      'venenatis',
      'Aenean rutrum erat venenatis, rhoncus lectus a, rutrum eros.',
      'vestibulum dictum amet',
      '2024-03-19T14:15:49',
      '2024-03-19T14:15:49',
      '089770f3-b5e4-4b28-bc2b-4419e57f0941',
      'Main corpus2',
      '',
      'English,Latin,Dutch',
      'subcorpus metadata ook gemapt',
      '',
    ],
    [
      '6ae49ba1-ef55-4989-bf30-c00704f4dc4a',
      'Corpus finibus',
      'Nullam ac nibh eget nunc venenatis tristique sed quis metus.',
      'ac aliquet',
      'Closed',
      'fermentum',
      '1990-01-30',
      '1990-01-31',
      'mauris',
      'Nam condimentum nibh vel nunc blandit, in eleifend turpis placerat.',
      'id turpis',
      '2024-03-19T14:15:49',
      '2024-03-19T14:17:34',
      '089770f3-b5e4-4b28-bc2b-4419e57f0941',
      'Main corpus2',
      '',
      'Latin,Western Frisian,Spanish',
      '',
      '',
    ],
  ];
}

function getExpectedCorpusSources() {
  return [
    [
      'corpus.id',
      'corpus.title',
      'id',
      'externalRef',
      'title',
      'description',
      'rights',
      'access',
      'creator',
      'location',
      'earliest',
      'latest',
      'notes',
      'ethics',
      'createdAt',
      'updatedAt',
      'languages',
      'metadata.my custom field',
      'metadata.other field',
      'tags',
    ],
    [
      '29795f78-9fb3-4693-97ab-bf9c4c7ef05c',
      'Main Corpus laoreet',
      '5b2c664d-f433-43ca-8027-e33439973829',
      'tincidunt faucibus risus tristique',
      'Source bibendum ante id pretium blandit.',
      'Quisque sed metus nec orci faucibus pretium.',
      'amet tellus',
      'Closed',
      'placerat',
      'turpis',
      '1990-01-30',
      '1990-01-31',
      'Integer maximus metus et orci congue finibus.',
      'donec viverra tincidunt aliquam',
      '2024-03-19T14:15:49',
      '2024-03-19T14:17:34',
      'Dutch,Latin,Western Frisian',
      'In et odio eleifend, feugiat ante accumsan, semper justo.',
      'Morbi non dolor id ligula porta elementum eu scelerisque enim.',
      'foo,bar,poi',
    ],
  ];
}

function getExpectedCorpusSourcesMedia(): ArrayTable {
  return [
    [
      'corpus.id',
      'corpus.title',
      'source.id',
      'source.title',
      'id',
      'title',
      'url',
    ],
    [
      '29795f78-9fb3-4693-97ab-bf9c4c7ef05c',
      'Main Corpus laoreet',
      '5b2c664d-f433-43ca-8027-e33439973829',
      'Source bibendum ante id pretium blandit.',
      '69909e4e-2e78-4ec2-b578-d30d35e499e8',
      'By Jantje1',
      'http://example.com/plaatje.jpg',
    ],
  ];
}

function getExpectedCorpusSourcesReferences(): ArrayTable {
  return [
    [
      'corpus.id',
      'corpus.title',
      'source.id',
      'source.title',
      'id',
      'input',
      'formatted',
    ],
    [
      '29795f78-9fb3-4693-97ab-bf9c4c7ef05c',
      'Main Corpus laoreet',
      '5b2c664d-f433-43ca-8027-e33439973829',
      'Source bibendum ante id pretium blandit.',
      '0d8a3db3-0f25-4bf6-955e-1d13803298d8',
      'https://doi.org/10.1057/978-1-137-52908-4_16',
      'Karrouche, N. (2017). National Narratives and the Invention of Ethnic Identities: Revisiting Cultural Memory and the Decolonized State in Morocco. In Palgrave Handbook of Research in Historical Culture and Education (pp. 295–310). Palgrave Macmillan UK. https://doi.org/10.1057/978-1-137-52908-4_16\n',
    ],
  ];
}

function getTestCorpus(): Corpus {
  return corpus as Corpus;
}

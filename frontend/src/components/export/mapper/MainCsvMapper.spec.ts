import { describe, expect, it } from '@jest/globals';
import { MainMapper } from './MainMapper';
import { Corpus } from '../../../model/DexterModel';
import { ArrayTable } from './ArrayTable';
import corpus from '../../../test/resources/corpus.json';

describe('MainCsvMapper', () => {
  const customMetadataKeys = ['my custom field', 'other field'];
  it('can map corpus', async () => {
    const toTest = new MainMapper(customMetadataKeys);
    const result = toTest.map(getTestCorpus());
    const expected = getExpectedCorpus();
    const actual = result[0].toCsvTable();
    expect(actual).toEqual(expected);

    expect(result.length).toEqual(4);
    const tableNames = result.map(t => t.name);
    tableNames.sort();
    expect(tableNames).toEqual(['corpus', 'media', 'references', 'sources']);
  });

  it('can map corpus sources', async () => {
    const toTest = new MainMapper(customMetadataKeys);
    const tables = toTest.map(getTestCorpus());
    const expected = getExpectedCorpusSources();
    expect(tables.length).toEqual(4);
    const sourcesTable = tables.find(t => t.name === 'sources');
    const csvSourcesTable = sourcesTable.toCsvTable();
    expect(sourcesTable.name).toEqual('sources');
    expect(csvSourcesTable.length).toEqual(3);
    expect(csvSourcesTable[0]).toEqual(expected[0]);
    expect(csvSourcesTable[1]).toEqual(expected[1]);
  });

  it('can map corpus source media', async () => {
    const toTest = new MainMapper(customMetadataKeys);
    const tables = toTest.map(getTestCorpus());
    const expected = getExpectedCorpusSourcesMedia();
    expect(tables.length).toEqual(4);
    const mediaTable = tables.find(t => t.name === 'media');
    const csvMediaTable = mediaTable.toCsvTable();
    expect(mediaTable.name).toEqual('media');
    expect(mediaTable.rows.length).toEqual(6);
    expect(csvMediaTable[0]).toEqual(expected[0]);
    expect(csvMediaTable[1]).toEqual(expected[1]);
  });
  it('can map corpus source references', async () => {
    const toTest = new MainMapper(customMetadataKeys);
    const tables = toTest.map(getTestCorpus());
    const expected = getExpectedCorpusSourcesReferences();
    expect(tables.length).toEqual(4);
    const referenceTable = tables.find(t => t.name === 'references');
    const csvReferencesTable = referenceTable.toCsvTable();
    expect(referenceTable.rows.length).toEqual(2);
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
      'createdBy',
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
      '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
      '2024-03-19T14:15:49',
      '2024-03-19T14:15:49',
      '089770f3-b5e4-4b28-bc2b-4419e57f0941',
      'Main corpus2',
      'foo,bar,poi',
      'English,Latin',
      'gemapt',
      'ook gemapt',
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
      'createdBy',
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
      '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
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
      'mediaType',
      'createdBy',
    ],
    [
      '29795f78-9fb3-4693-97ab-bf9c4c7ef05c',
      'Main Corpus laoreet',
      '5b2c664d-f433-43ca-8027-e33439973829',
      'Source bibendum ante id pretium blandit.',
      '69909e4e-2e78-4ec2-b578-d30d35e499e8',
      'By Jantje',
      'https://fastly.picsum.photos/id/78/1584/2376.jpg?hmac=80UVSwpa9Nfcq7sQ5kxb9Z5sD2oLsbd5zkFO5ybMC4E',
      'image/jpeg',
      '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
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

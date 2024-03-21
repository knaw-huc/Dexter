import { describe, expect, it } from '@jest/globals';
import { MainMapper } from './MainMapper';
import { Access, Corpus } from '../../model/DexterModel';

const corpus = getTestCorpus();

describe('MainCsvMapper', () => {
  const customMetadataKeys = ['my custom field', 'other field'];
  it('can map corpus', async () => {
    const toTest = new MainMapper(customMetadataKeys);
    const result = toTest.map(corpus);
    const expected = getExpectedCorpus();
    const actual = result.toCsvTable();
    expect(actual).toEqual(expected);
  });

  it('can map corpus sources', async () => {
    const toTest = new MainMapper(customMetadataKeys);
    const result = toTest.map(corpus);
    const expected = getExpectedCorpusSources();
    expect(result.tables.length).toEqual(1);
    const sourcesTable = result.tables[0];
    const csvSourcesTable = sourcesTable.toCsvTable();
    expect(sourcesTable.name).toEqual('sources');
    expect(csvSourcesTable.length).toEqual(3);
    expect(csvSourcesTable[0]).toEqual(expected[0]);
    expect(csvSourcesTable[1]).toEqual(expected[1]);
  });
});

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
      'references',
      'languages',
      'media',
      'metadata.my custom field',
      'metadata.other field',
      'tags',
    ],
    [
      '5b2c664d-f433-43ca-8027-e33439973829',
      'Phasellus bibendum ante id pretium blandit.',
      '5b2c664d-f433-43ca-8027-e33439973829',
      'tincidunt faucibus risus tristique',
      'Phasellus bibendum ante id pretium blandit.',
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
      '',
      'Dutch,Latin,Western Frisian',
      '[object Object],[object Object],[object Object]',
      'In et odio eleifend, feugiat ante accumsan, semper justo.',
      'Morbi non dolor id ligula porta elementum eu scelerisque enim.',
      'foo,bar,poi',
    ],
  ];
}

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
      'subcorpora',
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
      '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
      '2024-03-19T14:15:49',
      '2024-03-19T14:15:49',
      '089770f3-b5e4-4b28-bc2b-4419e57f0941',
      'Main corpus2',
      'foo,bar,poi',
      'English,Latin',
      'gemapt',
      'ook gemapt',
      '',
    ],
  ];
}

function getTestCorpus(): Corpus {
  return {
    id: '29795f78-9fb3-4693-97ab-bf9c4c7ef05c',
    title: 'Corpus laoreet',
    description: 'Nulla vitae dolor non urna scelerisque volutpat.',
    rights: 'proin',
    access: Access.OPEN,
    location: 'bibendum',
    earliest: '1990-01-30',
    latest: '1990-01-31',
    contributor: 'venenatis',
    notes: 'Aenean rutrum erat venenatis, rhoncus lectus a, rutrum eros.',
    ethics: 'vestibulum dictum amet',
    createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
    createdAt: '2024-03-19T14:15:49',
    updatedAt: '2024-03-19T14:15:49',
    parent: {
      id: '089770f3-b5e4-4b28-bc2b-4419e57f0941',
      parentId: null,
      title: 'Main corpus2',
      description: 'Donec tempor quam nec commodo iaculis.',
      rights: 'faucibus',
      access: Access.CLOSED,
      location: 'nisl',
      earliest: '1990-01-30',
      latest: '1990-01-31',
      contributor: 'nulla',
      notes: 'Fusce pretium risus sed porttitor fringilla.',
      ethics: 'feugiat',
      createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
      createdAt: '2024-03-19T14:15:49',
      updatedAt: '2024-03-19T14:45:10',
    },
    tags: [
      {
        id: 1,
        val: 'foo',
        createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
      },
      {
        id: 2,
        val: 'bar',
        createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
      },
      {
        id: 7,
        val: 'poi',
        createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
      },
    ],
    languages: [
      {
        id: 'eng',
        part2b: 'eng',
        part2t: 'eng',
        part1: 'en',
        scope: 'I',
        type: 'L',
        refName: 'English',
        comment: null,
      },
      {
        id: 'lat',
        part2b: 'lat',
        part2t: 'lat',
        part1: 'la',
        scope: 'I',
        type: 'H',
        refName: 'Latin',
        comment: null,
      },
    ],
    sources: [
      {
        id: '5b2c664d-f433-43ca-8027-e33439973829',
        externalRef: 'tincidunt faucibus risus tristique',
        title: 'Phasellus bibendum ante id pretium blandit.',
        description: 'Quisque sed metus nec orci faucibus pretium.',
        rights: 'amet tellus',
        access: Access.CLOSED,
        creator: 'placerat',
        location: 'turpis',
        earliest: '1990-01-30',
        latest: '1990-01-31',
        notes: 'Integer maximus metus et orci congue finibus.',
        ethics: 'donec viverra tincidunt aliquam',
        createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
        createdAt: '2024-03-19T14:15:49',
        updatedAt: '2024-03-19T14:17:34',
        references: [],
        corpora: [
          {
            id: '29795f78-9fb3-4693-97ab-bf9c4c7ef05c',
            parentId: '089770f3-b5e4-4b28-bc2b-4419e57f0941',
            title: 'Corpus laoreet',
            description: 'Nulla vitae dolor non urna scelerisque volutpat.',
            rights: 'proin',
            access: Access.OPEN,
            location: 'bibendum',
            earliest: '1990-01-30',
            latest: '1990-01-31',
            contributor: 'venenatis',
            notes:
              'Aenean rutrum erat venenatis, rhoncus lectus a, rutrum eros.',
            ethics: 'vestibulum dictum amet',
            createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
            createdAt: '2024-03-19T14:15:49',
            updatedAt: '2024-03-19T14:15:49',
          },
        ],
        languages: [
          {
            id: 'nld',
            part2b: 'dut',
            part2t: 'nld',
            part1: 'nl',
            scope: 'I',
            type: 'L',
            refName: 'Dutch',
            comment: null,
          },
          {
            id: 'lat',
            part2b: 'lat',
            part2t: 'lat',
            part1: 'la',
            scope: 'I',
            type: 'H',
            refName: 'Latin',
            comment: null,
          },
          {
            id: 'fry',
            part2b: 'fry',
            part2t: 'fry',
            part1: 'fy',
            scope: 'I',
            type: 'L',
            refName: 'Western Frisian',
            comment: null,
          },
        ],
        media: [
          {
            id: '69909e4e-2e78-4ec2-b578-d30d35e499e8',
            title: 'By Paul Evans',
            url: 'https://fastly.picsum.photos/id/78/1584/2376.jpg?hmac=80UVSwpa9Nfcq7sQ5kxb9Z5sD2oLsbd5zkFO5ybMC4E',
            mediaType: 'image/jpeg',
            createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
          },
          {
            id: '6e1ac407-8aa6-4f3c-89fa-440dc1083792',
            title: 'By Dorothy Lin',
            url: 'https://fastly.picsum.photos/id/79/2000/3011.jpg?hmac=TQsXWj0kLBLRXbSAh2Pygog1-cOefqpjEoKyl0uD3tg',
            mediaType: 'image/jpeg',
            createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
          },
          {
            id: '2b1098ee-0785-458e-b197-56873f9ad816',
            title: 'By Sonja Langford',
            url: 'https://fastly.picsum.photos/id/80/3888/2592.jpg?hmac=zD95NwXZ7mGAMj-z4444Elf43I4HJvd7Afm2tloweLw',
            mediaType: 'image/jpeg',
            createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
          },
        ],
        metadataValues: [
          {
            id: '15d5a6b6-f14f-410a-b797-5b728624cdb3',
            value: 'In et odio eleifend, feugiat ante accumsan, semper justo.',
            createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
            key: {
              id: '0aea0d07-451c-4ab1-b630-3999113b4e57',
              key: 'my custom field',
              createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
            },
          },
          {
            id: 'c8fddc8f-6382-4f2b-b5da-9104dd6df500',
            value:
              'Morbi non dolor id ligula porta elementum eu scelerisque enim.',
            createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
            key: {
              id: 'ab6ae421-dd9c-4dcf-9ff0-80f1fb9d3513',
              key: 'other field',
              createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
            },
          },
        ],
        tags: [
          {
            id: 1,
            val: 'foo',
            createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
          },
          {
            id: 2,
            val: 'bar',
            createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
          },
          {
            id: 7,
            val: 'poi',
            createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
          },
        ],
      },
      {
        id: '7787a679-ed53-4bd3-8535-e8ed1c740e68',
        externalRef: 'tincidunt faucibus risus tristique',
        title: 'Aenean non quam in diam tristique gravida.',
        description:
          'Fusce et libero tristique, lobortis libero sit amet, pretium mi.',
        rights: 'nibh',
        access: Access.CLOSED,
        creator: 'dictum sapien vulputate pulvinar venenatis',
        location: 'tristique',
        earliest: '1990-01-30',
        latest: '1990-01-31',
        notes: 'Cras auctor elit in vestibulum semper.',
        ethics: 'tristique finibus semper venenatis auctor',
        createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
        createdAt: '2024-03-19T14:15:49',
        updatedAt: '2024-03-19T14:15:53',
        references: [],
        corpora: [
          {
            id: '29795f78-9fb3-4693-97ab-bf9c4c7ef05c',
            parentId: '089770f3-b5e4-4b28-bc2b-4419e57f0941',
            title: 'Corpus laoreet',
            description: 'Nulla vitae dolor non urna scelerisque volutpat.',
            rights: 'proin',
            access: Access.OPEN,
            location: 'bibendum',
            earliest: '1990-01-30',
            latest: '1990-01-31',
            contributor: 'venenatis',
            notes:
              'Aenean rutrum erat venenatis, rhoncus lectus a, rutrum eros.',
            ethics: 'vestibulum dictum amet',
            createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
            createdAt: '2024-03-19T14:15:49',
            updatedAt: '2024-03-19T14:15:49',
          },
        ],
        languages: [
          {
            id: 'zim',
            part2b: null,
            part2t: null,
            part1: null,
            scope: 'I',
            type: 'L',
            refName: 'Mesme',
            comment: null,
          },
          {
            id: 'fry',
            part2b: 'fry',
            part2t: 'fry',
            part1: 'fy',
            scope: 'I',
            type: 'L',
            refName: 'Western Frisian',
            comment: null,
          },
          {
            id: 'spa',
            part2b: 'spa',
            part2t: 'spa',
            part1: 'es',
            scope: 'I',
            type: 'L',
            refName: 'Spanish',
            comment: null,
          },
        ],
        media: [
          {
            id: '69e77028-5a91-4fbb-8f2f-abd955e7510f',
            title: 'By Sander Weeteling',
            url: 'https://fastly.picsum.photos/id/81/5000/3250.jpg?hmac=gFiddUc7I25C06HUIMesyaFCjSOWE3L3uDl0QSyuX4M',
            mediaType: 'image/jpeg',
            createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
          },
          {
            id: '4ea4c0a0-ee48-4913-883c-f31ef0b522da',
            title: 'By Rula Sibai',
            url: 'https://fastly.picsum.photos/id/82/1500/997.jpg?hmac=VcdCqu9YiLpbCtr8YowUCSUD3-245TGekiXmtiMXotw',
            mediaType: 'image/jpeg',
            createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
          },
          {
            id: 'ee23cd21-cb13-4be8-8b5e-83545d340740',
            title: 'By Julie Geiger',
            url: 'https://fastly.picsum.photos/id/83/2560/1920.jpg?hmac=LFdAxfpbYKs0hZr0LhHVWyqXarWGg7FtM8pIzJPBc0w',
            mediaType: 'image/jpeg',
            createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
          },
        ],
        metadataValues: [
          {
            id: '0bb7118b-b7fe-4815-a393-1429eccf163c',
            value:
              'Etiam lobortis est non ligula laoreet, sit amet hendrerit urna volutpat.',
            createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
            key: {
              id: '0aea0d07-451c-4ab1-b630-3999113b4e57',
              key: 'my custom field',
              createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
            },
          },
          {
            id: '9a4345dd-7378-462b-b74b-2a87a1ee37f1',
            value: 'Vestibulum vel quam sit amet dui tempus cursus ut ac eros.',
            createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
            key: {
              id: 'ab6ae421-dd9c-4dcf-9ff0-80f1fb9d3513',
              key: 'other field',
              createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
            },
          },
        ],
        tags: [
          {
            id: 8,
            val: 'test',
            createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
          },
        ],
      },
    ],
    metadataValues: [
      {
        id: '0bb7118b-b7fe-4815-a393-1429eccf163c',
        value: 'gemapt',
        createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
        key: {
          id: '0aea0d07-451c-4ab1-b630-3999113b4e57',
          key: 'my custom field',
          createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
        },
      },
      {
        id: '9a4345dd-7378-462b-b74b-2a87a1ee37f1',
        value: 'ook gemapt',
        createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
        key: {
          id: 'ab6ae421-dd9c-4dcf-9ff0-80f1fb9d3513',
          key: 'other field',
          createdBy: '9d950d38-8e03-4e90-9f0d-0c397f4e65b9',
        },
      },
    ],
    subcorpora: [],
  };
}

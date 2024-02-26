import {
  Corpus,
  FormCorpus,
  FormMedia,
  FormMetadataKey,
  FormMetadataValue,
  FormSource,
  FormTag,
  ResultImport,
  ResultLanguage,
  ResultMedia,
  ResultMetadataKey,
  ResultMetadataValue,
  ResultSource,
  ResultTag,
  Source,
  SupportedMediaTypeType,
  UUID,
} from '../model/DexterModel';
import { validateResponse } from './validateResponse';
import _ from 'lodash';
import {
  api,
  corpora,
  keys,
  media,
  metadata,
  sources,
  tags,
  values,
  withResources,
} from '../model/Resources';

// Update methods:
const POST = 'POST';
const PUT = 'PUT';

export const headers = {
  'Content-Type': 'application/json',
};

export type ResponseErrorParams = {
  response: Response;
};

export class ResponseError extends Error {
  response: Response;
  constructor(params: ResponseErrorParams) {
    super();
    const { statusText, url, status } = params.response;
    this.message = `${statusText}: request to ${url} failed with ${status}`;
    this.name = this.constructor.name;
    this.response = params.response;
  }
}

export async function toReadable(prefixMessage: string, e: ResponseError) {
  const json = await e.response.json();
  return { message: `${prefixMessage}: ${json.message}` };
}

async function fetchValidated(path: string, params?: Record<string, string>) {
  let url = path;
  if (!_.isEmpty(params)) {
    url += `?${new URLSearchParams(params)}`;
  }
  const response = await fetch(url, {
    headers,
    method: 'GET',
  });
  validateResponse({ response });
  return response.json();
}

async function fetchValidatedWith(
  url: string,
  method: 'PUT' | 'POST',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: string | any,
) {
  let body: string;
  if (_.isNil(content)) {
    body = '';
  } else if (_.isString(content)) {
    body = content;
  } else {
    body = JSON.stringify(content);
  }
  const response = await fetch(url, {
    method,
    body,
    headers: headers,
  });
  validateResponse({ response });
  return response.json();
}

async function fetchValidatedDelete(url: string): Promise<void> {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: headers,
  });
  validateResponse({ response });
}

export const getCorporaWithResources = async (): Promise<Corpus[]> => {
  return fetchValidated(`/${api}/${corpora}/${withResources}`);
};

export const getCorpusWithResourcesById = async (id: string): Promise<Corpus> =>
  fetchValidated(`/${api}/${corpora}/${id}/${withResources}`);

export const createCorpus = async (newCorpus: FormCorpus): Promise<Corpus> =>
  fetchValidatedWith(`/${api}/${corpora}`, POST, newCorpus);
export const updateCorpus = async (
  id: string,
  updatedCorpus: FormCorpus,
): Promise<Corpus> =>
  fetchValidatedWith(`/${api}/${corpora}/${id}`, PUT, updatedCorpus);

export const deleteCollection = async (id: string): Promise<void> =>
  fetchValidatedDelete(`/${api}/${corpora}/${id}`);

export const getSourcesWithResources = async (): Promise<Source[]> => {
  return fetchValidated(`/${api}/${sources}/${withResources}`);
};

export const getSourceWithResourcesById = async (id: string) =>
  fetchValidated(`/${api}/${sources}/${id}/${withResources}`);

export const createSource = async (
  newSource: FormSource,
): Promise<ResultSource> =>
  fetchValidatedWith(`/${api}/${sources}`, POST, newSource);

export const updateSource = async (
  id: string,
  updatedSource: FormSource,
): Promise<Source> =>
  fetchValidatedWith(`/${api}/${sources}/${id}`, PUT, updatedSource);

export const deleteSource = async (id: string): Promise<void> =>
  fetchValidatedDelete(`/${api}/${sources}/${id}`);

export const getTags = async () => fetchValidated(`/${api}/${tags}`);

export const createTag = async (newTag: FormTag): Promise<ResultTag> =>
  fetchValidatedWith(`/${api}/${tags}`, POST, newTag);

export const addTagsToCorpus = async (
  corpusId: string,
  tagId: string[],
): Promise<ResultTag[]> =>
  fetchValidatedWith(`/${api}/${corpora}/${corpusId}/${tags}`, POST, tagId);

export const addTagsToSource = async (
  sourceId: string,
  tagId: string[],
): Promise<ResultTag[]> =>
  fetchValidatedWith(`/${api}/${sources}/${sourceId}/${tags}`, POST, tagId);

export const deleteTag = async (id: string): Promise<void> =>
  fetchValidatedDelete(`/${api}/${tags}/${id}`);

export const getTagsAutocomplete = async (
  input: string,
): Promise<ResultTag[]> =>
  fetchValidatedWith(`/${api}/${tags}/autocomplete`, POST, input);

export const getLanguagesAutocomplete = async (
  input: string,
): Promise<ResultLanguage[]> =>
  fetchValidatedWith(`/${api}/languages/autocomplete`, POST, input);

export const addLanguagesToCorpus = async (
  corpusId: string,
  languageId: string[],
): Promise<ResultLanguage[]> =>
  fetchValidatedWith(
    `/${api}/${corpora}/${corpusId}/languages`,
    POST,
    languageId,
  );

export const deleteLanguageFromCorpus = async (
  corpusId: string,
  languageId: string,
): Promise<void> =>
  fetchValidatedDelete(
    `/${api}/${corpora}/${corpusId}/languages/${languageId}`,
  );

export const addLanguagesToSource = async (
  corpusId: string,
  languageId: string[],
): Promise<ResultLanguage[]> =>
  fetchValidatedWith(
    `/${api}/${sources}/${corpusId}/languages`,
    POST,
    languageId,
  );

export const deleteLanguageFromSource = async (
  sourceId: string,
  languageId: string,
): Promise<void> =>
  fetchValidatedDelete(
    `/${api}/${sources}/${sourceId}/languages/${languageId}`,
  );

export const deleteTagFromCorpus = async (
  corpusId: string,
  tagId: string,
): Promise<void> =>
  fetchValidatedDelete(`/${api}/${corpora}/${corpusId}/${tags}/${tagId}`);

export const deleteTagFromSource = async (
  sourceId: string,
  tagId: string,
): Promise<void> =>
  fetchValidatedDelete(`/${api}/${sources}/${sourceId}/${tags}/${tagId}`);

export const addSourcesToCorpus = async (
  corpusId: string,
  sourceIds: string[],
): Promise<Source[]> =>
  fetchValidatedWith(
    `/${api}/${corpora}/${corpusId}/${sources}`,
    POST,
    sourceIds,
  );

export const deleteSourceFromCorpus = async (
  corpusId: string,
  sourceId: string,
): Promise<void> =>
  fetchValidatedDelete(`/${api}/${corpora}/${corpusId}/${sources}/${sourceId}`);

export type ResultDublinCoreMetadata = Record<string, string>;

export const postImport = async (url: URL): Promise<ResultImport> =>
  fetchValidatedWith(`/${api}/import/wereldculturen`, POST, { url });

export type LoginResponse = {
  name: string;
};
export const login = async (): Promise<LoginResponse> =>
  fetchValidatedWith(`/${api}/user/login`, POST);

/**
 * Metadata
 */

export const getMetadataKeys = async (): Promise<ResultMetadataKey[]> =>
  fetchValidated(`/${api}/${metadata}/${keys}`);

export const deleteMetadataKey = async (id: string): Promise<void> =>
  fetchValidatedDelete(`/${api}/${metadata}/${keys}/${id}`);

export const deleteMetadataValue = async (id: string): Promise<void> =>
  fetchValidatedDelete(`/${api}/${metadata}/${values}/${id}`);

export const deleteMetadataValueFromSource = async (
  _: string,
  metadataValueId: string,
): Promise<void> => deleteMetadataValue(metadataValueId);
export const deleteMetadataValueFromCorpus = async (
  _: string,
  metadataValueId: string,
): Promise<void> => deleteMetadataValue(metadataValueId);

export const createMetadataKey = async (
  newTag: FormMetadataKey,
): Promise<ResultMetadataKey> =>
  fetchValidatedWith(`/${api}/${metadata}/${keys}`, POST, newTag);

export const updateMetadataKey = async (
  id: UUID,
  newTag: FormMetadataKey,
): Promise<ResultMetadataKey> =>
  fetchValidatedWith(`/${api}/${metadata}/${keys}/${id}`, PUT, newTag);

export const createMetadataValue = async (
  form: FormMetadataValue,
): Promise<ResultMetadataValue> =>
  fetchValidatedWith(`/${api}/${metadata}/${values}`, POST, form);

export const updateMetadataValue = (
  id: UUID,
  form: FormMetadataValue,
): Promise<ResultMetadataValue> =>
  fetchValidatedWith(`/${api}/${metadata}/${values}/${id}`, PUT, form);

export const addMetadataValueToSource = async (
  sourceId: string,
  metadataValueIds: string[],
): Promise<ResultMetadataValue[]> =>
  fetchValidatedWith(
    `/${api}/${sources}/${sourceId}/${metadata}/${values}`,
    POST,
    metadataValueIds,
  );

export const addMetadataValueToCorpus = async (
  corpusId: string,
  metadataValueIds: string[],
): Promise<ResultMetadataValue[]> =>
  fetchValidatedWith(
    `/${api}/${corpora}/${corpusId}/${metadata}/${values}`,
    POST,
    metadataValueIds,
  );

/**
 * Media:
 */
export const getMedia = async (
  type?: SupportedMediaTypeType,
): Promise<ResultMedia[]> => fetchValidated(`/${api}/${media}`, { type });

export const getMediaEntry = async (id: UUID): Promise<ResultMedia> =>
  fetchValidated(`/${api}/${media}/${id}`);

export const createMedia = async (form: FormMedia): Promise<ResultMedia> =>
  fetchValidatedWith(`/${api}/${media}`, POST, form);

export const updateMedia = async (
  id: UUID,
  form: FormMedia,
): Promise<ResultMedia> =>
  fetchValidatedWith(`/${api}/${media}/${id}`, PUT, form);

export const deleteMedia = async (mediaId: UUID) =>
  fetchValidatedDelete(`/${api}/${media}/${mediaId}`);

export const addMediaToSource = async (
  sourceId: string,
  mediaIds: string[],
): Promise<ResultMedia[]> =>
  fetchValidatedWith(`/${api}/${sources}/${sourceId}/${media}`, POST, mediaIds);

export const addMediaToCorpus = async (
  corpusId: string,
  mediaIds: string[],
): Promise<ResultMedia[]> =>
  fetchValidatedWith(`/${api}/${corpora}/${corpusId}/${media}`, POST, mediaIds);

export const deleteMediaFromCorpus = async (
  corpusId: string,
  mediaId: string,
): Promise<void> =>
  fetchValidatedDelete(`/${api}/${corpora}/${corpusId}/${media}/${mediaId}`);

export const deleteMediaFromSource = async (
  sourceId: string,
  mediaId: string,
): Promise<void> =>
  fetchValidatedDelete(`/${api}/${sources}/${sourceId}/${media}/${mediaId}`);

export const getMediaAutocomplete = async (
  input: string,
): Promise<ResultMedia[]> =>
  fetchValidatedWith(`/${api}/${media}/autocomplete`, POST, input);

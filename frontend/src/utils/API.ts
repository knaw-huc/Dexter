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
  UUID,
} from '../model/DexterModel';
import { validateResponse } from './validateResponse';
import { fetchValidated } from './fetchValidated';

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

async function fetchValidatedWith(
  url: string,
  method: 'PUT' | 'POST',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any,
) {
  const response = await fetch(url, {
    method,
    body: JSON.stringify(json),
    headers: headers,
  });
  validateResponse({ response });
  return response.json();
}

async function fetchDeleteValidated(url: string) {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: headers,
  });
  validateResponse({ response });
  return response.json();
}

export const getCorporaWithResources = async (): Promise<Corpus[]> => {
  return fetchValidated('/api/corpora/with-resources');
};

export const getCorpusWithResourcesById = async (
  id: string,
): Promise<Corpus> => {
  return fetchValidated(`/api/corpora/${id}/with-resources`);
};

export const createCorpus = async (newCorpus: FormCorpus): Promise<Corpus> => {
  const path = '/api/corpora';
  const response = await fetch(path, {
    headers,
    method: 'POST',
    body: JSON.stringify(newCorpus),
  });
  validateResponse({ response });
  return response.json();
};

export const updateCorpus = async (
  id: string,
  updatedCorpus: FormCorpus,
): Promise<Corpus> => {
  const path = `/api/corpora/${id}`;
  const response = await fetch(path, {
    headers,
    method: 'PUT',
    body: JSON.stringify(updatedCorpus),
  });
  validateResponse({ response });
  return response.json();
};

export const deleteCollection = async (id: string): Promise<void> => {
  const path = `/api/corpora/${id}`;
  const response = await fetch(path, {
    headers,
    method: 'DELETE',
  });
  validateResponse({ response });
};

export const getSourcesWithResources = async (): Promise<Source[]> => {
  return fetchValidated('/api/sources/with-resources');
};

export async function getSourceById(id: string): Promise<ResultSource> {
  return fetchValidated(`/api/sources/${id}`);
}

export async function getSourceWithResourcesById(id: string): Promise<Source> {
  return fetchValidated(`/api/sources/${id}/with-resources`);
}

export const createSource = async (
  newSource: FormSource,
): Promise<ResultSource> => {
  const path = '/api/sources';
  const response = await fetch(path, {
    headers,
    method: 'POST',
    body: JSON.stringify(newSource),
  });
  validateResponse({ response });
  return response.json();
};

export const updateSource = async (
  id: string,
  updatedSource: FormSource,
): Promise<Source> => {
  const path = `/api/sources/${id}`;
  const response = await fetch(path, {
    headers,
    method: 'PUT',
    body: JSON.stringify(updatedSource),
  });
  validateResponse({ response });
  return response.json();
};

export const deleteSource = async (id: string): Promise<void> => {
  const path = `/api/sources/${id}`;
  const response = await fetch(path, {
    headers,
    method: 'DELETE',
  });
  validateResponse({ response });
};

export const getTags = async () => {
  return fetchValidated(`/api/tags`);
};

export const createTag = async (newTag: FormTag): Promise<ResultTag> => {
  const response = await fetch('/api/tags', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(newTag),
  });
  validateResponse({ response });
  return response.json();
};

export const addTagsToCorpus = async (
  corpusId: string,
  tagId: string[],
): Promise<ResultTag[]> => {
  const response = await fetch(`/api/corpora/${corpusId}/tags`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(tagId),
  });
  validateResponse({ response });
  return response.json();
};

export const addTagsToSource = async (
  sourceId: string,
  tagId: string[],
): Promise<ResultTag[]> => {
  const response = await fetch(`/api/sources/${sourceId}/tags`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(tagId),
  });
  validateResponse({ response });
  return response.json();
};

export const deleteTag = async (id: string): Promise<void> => {
  const response = await fetch(`/api/tags/${id}`, {
    method: 'DELETE',
    headers: headers,
  });
  validateResponse({ response });
};

export const getTagsAutocomplete = async (
  input: string,
): Promise<ResultTag[]> => {
  const response = await fetch('/api/tags/autocomplete', {
    method: 'POST',
    headers: headers,
    body: input,
  });
  validateResponse({ response });
  return response.json();
};

export const getLanguagesAutocomplete = async (
  input: string,
): Promise<ResultLanguage[]> => {
  const response = await fetch('/api/languages/autocomplete', {
    method: 'POST',
    headers: headers,
    body: input,
  });
  validateResponse({ response });
  return response.json();
};

export const addLanguagesToCorpus = async (
  corpusId: string,
  languageId: string[],
): Promise<ResultLanguage[]> => {
  const response = await fetch(`/api/corpora/${corpusId}/languages`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(languageId),
  });
  validateResponse({ response });
  return response.json();
};

export const deleteLanguageFromCorpus = async (
  corpusId: string,
  languageId: string,
): Promise<ResultLanguage[]> => {
  const response = await fetch(
    `/api/corpora/${corpusId}/languages/${languageId}`,
    {
      method: 'DELETE',
      headers: headers,
    },
  );
  validateResponse({ response });
  return response.json();
};

export const addLanguagesToSource = async (
  corpusId: string,
  languageId: string[],
): Promise<ResultLanguage[]> => {
  const response = await fetch(`/api/sources/${corpusId}/languages`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(languageId),
  });
  validateResponse({ response });
  return response.json();
};

export const deleteLanguageFromSource = async (
  sourceId: string,
  languageId: string,
): Promise<void> => {
  const response = await fetch(
    `/api/sources/${sourceId}/languages/${languageId}`,
    {
      method: 'DELETE',
      headers: headers,
    },
  );
  validateResponse({ response });
};

export const deleteTagFromCorpus = async (
  corpusId: string,
  tagId: string,
): Promise<void> => {
  const response = await fetch(`/api/corpora/${corpusId}/tags/${tagId}`, {
    method: 'DELETE',
    headers: headers,
  });
  validateResponse({ response });
};

export const deleteTagFromSource = async (
  sourceId: string,
  tagId: string,
): Promise<void> => {
  const response = await fetch(`/api/sources/${sourceId}/tags/${tagId}`, {
    method: 'DELETE',
    headers: headers,
  });
  validateResponse({ response });
};

export const addSourcesToCorpus = async (
  corpusId: string,
  sourceIds: string[],
): Promise<Source[]> => {
  const response = await fetch(`/api/corpora/${corpusId}/sources`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(sourceIds),
  });
  validateResponse({ response });
  return response.json();
};

export const deleteSourceFromCorpus = async (
  corpusId: string,
  sourceId: string,
): Promise<void> => {
  const response = await fetch(`/api/corpora/${corpusId}/sources/${sourceId}`, {
    method: 'DELETE',
    headers: headers,
  });
  validateResponse({ response });
};

export type ResultDublinCoreMetadata = Record<string, string>;

export async function postImport(url: URL): Promise<ResultImport> {
  const path = '/api/import/wereldculturen';
  const response = await fetch(path, {
    headers,
    method: 'POST',
    body: JSON.stringify({ url }),
  });
  validateResponse({ response });
  return response.json();
}

export type LoginResponse = {
  name: string;
};
export async function login(): Promise<LoginResponse> {
  const path = '/api/user/login';
  const response = await fetch(path, {
    headers: {
      ...headers,
    },
    method: 'POST',
  });
  validateResponse({ response });
  return response.json();
}

// Metadata

export const getMetadataKeys = async function (): Promise<ResultMetadataKey[]> {
  return fetchValidated(`/api/metadata/keys`);
};

export const deleteMetadataKey = async function (id: string): Promise<void> {
  const path = `/api/metadata/keys/${id}`;
  const response = await fetch(path, {
    headers,
    method: 'DELETE',
  });
  validateResponse({ response });
};

export const deleteMetadataValue = async function (id: string): Promise<void> {
  const path = `/api/metadata/values/${id}`;
  const response = await fetch(path, {
    headers,
    method: 'DELETE',
  });
  validateResponse({ response });
};
export const deleteMetadataValueFromSource = async (
  _: string,
  metadataValueId: string,
): Promise<void> => deleteMetadataValue(metadataValueId);
export const deleteMetadataValueFromCorpus = async (
  _: string,
  metadataValueId: string,
): Promise<void> => deleteMetadataValue(metadataValueId);

export async function createMetadataKey(
  newTag: FormMetadataKey,
): Promise<ResultMetadataKey> {
  const response = await fetch('/api/metadata/keys', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(newTag),
  });
  validateResponse({ response });
  return response.json();
}

export async function updateMetadataKey(
  id: UUID,
  newTag: FormMetadataKey,
): Promise<ResultMetadataKey> {
  const response = await fetch(`/api/metadata/keys/${id}`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(newTag),
  });
  validateResponse({ response });
  return response.json();
}

export async function createMetadataValue(
  form: FormMetadataValue,
): Promise<ResultMetadataValue> {
  const response = await fetch(`/api/metadata/values`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(form),
  });
  validateResponse({ response });
  return response.json();
}

export const updateMetadataValue = (
  id: UUID,
  form: FormMetadataValue,
): Promise<ResultMetadataValue> =>
  fetchValidatedWith(`/api/metadata/values/${id}`, 'PUT', form);

export const addMetadataValueToSource = async (
  sourceId: string,
  metadataValueIds: string[],
): Promise<ResultMetadataValue[]> =>
  fetchValidatedWith(
    `/api/sources/${sourceId}/metadata/values`,
    'POST',
    metadataValueIds,
  );

export const addMetadataValueToCorpus = async (
  corpusId: string,
  metadataValueIds: string[],
): Promise<ResultMetadataValue[]> =>
  fetchValidatedWith(
    `/api/corpora/${corpusId}/metadata/values`,
    'POST',
    metadataValueIds,
  );

export const createMedia = async (form: FormMedia) =>
  fetchValidatedWith(`/api/media`, 'POST', form);

export const updateMedia = async (
  id: UUID,
  form: FormMedia,
): Promise<ResultMedia> => fetchValidatedWith(`/api/media/${id}`, 'PUT', form);

export const deleteMedia = async (mediaId: UUID) =>
  fetchDeleteValidated(`/api/media/${mediaId}`);

export const addMediaToSource = async (
  sourceId: string,
  mediaIds: string[],
): Promise<ResultMedia[]> =>
  fetchValidatedWith(`/api/sources/${sourceId}/media`, 'POST', mediaIds);

export const addMediaToCorpus = async (
  corpusId: string,
  mediaIds: string[],
): Promise<ResultMedia[]> =>
  fetchValidatedWith(`/api/corpora/${corpusId}/media`, 'POST', mediaIds);

export const deleteMediaFromCorpus = async (
  corpusId: string,
  mediaId: string,
): Promise<ResultLanguage[]> =>
  fetchDeleteValidated(`/api/corpora/${corpusId}/media/${mediaId}`);

export const deleteMediaFromSource = async (
  sourceId: string,
  mediaId: string,
): Promise<ResultLanguage[]> =>
  fetchDeleteValidated(`/api/sources/${sourceId}/media/${mediaId}`);

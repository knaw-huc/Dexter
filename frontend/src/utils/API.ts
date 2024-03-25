import {
  Corpus,
  FormReference,
  FormCorpus,
  FormMedia,
  FormMetadataKey,
  FormMetadataValue,
  FormSource,
  FormTag,
  ResultReference,
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
  references,
  corpora,
  keys,
  media,
  metadata,
  sources,
  tags,
  user,
  values,
  withResources,
  assets,
} from '../model/Resources';
import { ErrorWithMessage } from '../components/common/error/ErrorWithMessage';
import { Any } from '../components/common/Any';

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
  body: ErrorWithMessage;
  private constructor() {
    super();
  }
  static async from(params: ResponseErrorParams): Promise<ResponseError> {
    const e = new ResponseError();
    const { statusText, url, status } = params.response;
    const statusPrefix = statusText ? statusText + ': ' : '';
    e.message = `${statusPrefix}request to ${url} failed with ${status}`;
    e.name = this.constructor.name;
    e.response = params.response.clone();
    try {
      e.body = await params.response.clone().json();
    } catch (e) {
      e.body = { message: await params.response.clone().text() };
    }
    return e;
  }
}

export async function toReadable(prefixMessage: string, e: ResponseError) {
  return { message: `${prefixMessage}: ${e.body.message}` };
}

async function getValidated(path: string, params?: Record<string, string>) {
  let url = path;
  if (!_.isEmpty(params)) {
    url += `?${new URLSearchParams(params)}`;
  }
  const response = await fetch(url, {
    headers,
    method: 'GET',
  });
  await validateResponse({ response });
  return response.json();
}

type BodyToStringify = string | Any;

const postValidated = (url: string, content?: BodyToStringify) =>
  fetchValidatedWith(url, POST, content);
const putValidated = (url: string, content?: BodyToStringify) =>
  fetchValidatedWith(url, PUT, content);

async function fetchValidatedWith(
  url: string,
  method: 'PUT' | 'POST',
  content?: BodyToStringify,
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
  await validateResponse({ response });
  return response.json();
}

async function deleteValidated(url: string): Promise<void> {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: headers,
  });
  await validateResponse({ response });
}

export async function getAssetValidated(
  cslFilename: string,
): Promise<Response> {
  const response = await fetch(
    `${window.location.origin}/${api}/${assets}/${cslFilename}`,
  );
  await validateResponse({ response });
  return response;
}

/**
 * Corpus:
 */

export const getCorporaWithResources = async (): Promise<Corpus[]> => {
  return getValidated(`/${api}/${corpora}/${withResources}`);
};

export const getCorpusWithResourcesById = async (id: string): Promise<Corpus> =>
  getValidated(`/${api}/${corpora}/${id}/${withResources}`);

export const createCorpus = async (newCorpus: FormCorpus): Promise<Corpus> =>
  postValidated(`/${api}/${corpora}`, newCorpus);
export const updateCorpus = async (
  id: string,
  updatedCorpus: FormCorpus,
): Promise<Corpus> => putValidated(`/${api}/${corpora}/${id}`, updatedCorpus);

export const deleteCorpus = async (id: string): Promise<void> =>
  deleteValidated(`/${api}/${corpora}/${id}`);

/**
 * Source:
 */

export const getSourcesWithResources = async (): Promise<Source[]> => {
  return getValidated(`/${api}/${sources}/${withResources}`);
};

export const getSourceWithResourcesById = async (id: string) =>
  getValidated(`/${api}/${sources}/${id}/${withResources}`);

export const createSource = async (
  newSource: FormSource,
): Promise<ResultSource> => postValidated(`/${api}/${sources}`, newSource);

export const updateSource = async (
  id: string,
  updatedSource: FormSource,
): Promise<Source> => putValidated(`/${api}/${sources}/${id}`, updatedSource);

export const deleteSource = async (id: string): Promise<void> =>
  deleteValidated(`/${api}/${sources}/${id}`);

export const addSourcesToCorpus = async (
  corpusId: string,
  sourceIds: string[],
): Promise<Source[]> =>
  postValidated(`/${api}/${corpora}/${corpusId}/${sources}`, sourceIds);

export const deleteSourceFromCorpus = async (
  corpusId: string,
  sourceId: string,
): Promise<void> =>
  deleteValidated(`/${api}/${corpora}/${corpusId}/${sources}/${sourceId}`);

/**
 * Language:
 */

export const getLanguagesAutocomplete = async (
  input: string,
): Promise<ResultLanguage[]> =>
  postValidated(`/${api}/languages/autocomplete`, input);

export const addLanguagesToCorpus = async (
  corpusId: string,
  languageId: string[],
): Promise<ResultLanguage[]> =>
  postValidated(`/${api}/${corpora}/${corpusId}/languages`, languageId);

export const deleteLanguageFromCorpus = async (
  corpusId: string,
  languageId: string,
): Promise<void> =>
  deleteValidated(`/${api}/${corpora}/${corpusId}/languages/${languageId}`);

export const addLanguagesToSource = async (
  corpusId: string,
  languageId: string[],
): Promise<ResultLanguage[]> =>
  postValidated(`/${api}/${sources}/${corpusId}/languages`, languageId);

export const deleteLanguageFromSource = async (
  sourceId: string,
  languageId: string,
): Promise<void> =>
  deleteValidated(`/${api}/${sources}/${sourceId}/languages/${languageId}`);

/**
 * Tags:
 */

export const getTags = async () => getValidated(`/${api}/${tags}`);

export const createTag = async (newTag: FormTag): Promise<ResultTag> =>
  postValidated(`/${api}/${tags}`, newTag);

export const addTagsToCorpus = async (
  corpusId: string,
  tagId: string[],
): Promise<ResultTag[]> =>
  postValidated(`/${api}/${corpora}/${corpusId}/${tags}`, tagId);

export const addTagsToSource = async (
  sourceId: string,
  tagId: string[],
): Promise<ResultTag[]> =>
  postValidated(`/${api}/${sources}/${sourceId}/${tags}`, tagId);

export const deleteTag = async (id: number): Promise<void> =>
  deleteValidated(`/${api}/${tags}/${id}`);

export const getTagsAutocomplete = async (
  input: string,
): Promise<ResultTag[]> => postValidated(`/${api}/${tags}/autocomplete`, input);

export const deleteTagFromCorpus = async (
  corpusId: string,
  tagId: string,
): Promise<void> =>
  deleteValidated(`/${api}/${corpora}/${corpusId}/${tags}/${tagId}`);

export const deleteTagFromSource = async (
  sourceId: string,
  tagId: string,
): Promise<void> =>
  deleteValidated(`/${api}/${sources}/${sourceId}/${tags}/${tagId}`);

/**
 * References:
 */

export const getReferences = async (): Promise<ResultReference[]> =>
  getValidated(`/${api}/${references}`);

export const createReference = async (
  newReference: FormReference,
): Promise<ResultReference> =>
  postValidated(`/${api}/${references}`, newReference);

export const addReferencesToCorpus = async (
  corpusId: string,
  referenceId: string[],
): Promise<ResultReference[]> =>
  postValidated(`/${api}/${corpora}/${corpusId}/${references}`, referenceId);

export const addReferencesToSource = async (
  sourceId: string,
  referenceId: string[],
): Promise<ResultReference[]> =>
  postValidated(`/${api}/${sources}/${sourceId}/${references}`, referenceId);

export const deleteReference = async (id: string): Promise<void> =>
  deleteValidated(`/${api}/${references}/${id}`);

export const getReferenceAutocomplete = async (
  input: string,
): Promise<ResultReference[]> =>
  postValidated(`/${api}/${references}/autocomplete`, input);

export const deleteReferenceFromCorpus = async (
  corpusId: string,
  referenceId: string,
): Promise<void> =>
  deleteValidated(
    `/${api}/${corpora}/${corpusId}/${references}/${referenceId}`,
  );

export const deleteReferenceFromSource = async (
  sourceId: string,
  referenceId: string,
): Promise<void> =>
  deleteValidated(
    `/${api}/${sources}/${sourceId}/${references}/${referenceId}`,
  );

export const getReferenceById = async (id: string): Promise<ResultReference> =>
  getValidated(`/${api}/${references}/${id}`);

/**
 * Import:
 */

export const postImport = async (url: URL): Promise<ResultImport> =>
  postValidated(`/${api}/import/wereldculturen`, { url });

/**
 * User:
 */

export type LoginResponse = {
  name: string;
};
export const login = async (): Promise<LoginResponse> =>
  postValidated(`/${api}/${user}/login`);

/**
 * Metadata:
 */

export const getMetadataKeys = async (): Promise<ResultMetadataKey[]> =>
  getValidated(`/${api}/${metadata}/${keys}`);

export const deleteMetadataKey = async (id: string): Promise<void> =>
  deleteValidated(`/${api}/${metadata}/${keys}/${id}`);

export const deleteMetadataValue = async (id: string): Promise<void> =>
  deleteValidated(`/${api}/${metadata}/${values}/${id}`);

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
  postValidated(`/${api}/${metadata}/${keys}`, newTag);

export const updateMetadataKey = async (
  id: UUID,
  newTag: FormMetadataKey,
): Promise<ResultMetadataKey> =>
  putValidated(`/${api}/${metadata}/${keys}/${id}`, newTag);

export const createMetadataValue = async (
  form: FormMetadataValue,
): Promise<ResultMetadataValue> =>
  postValidated(`/${api}/${metadata}/${values}`, form);

export const updateMetadataValue = (
  id: UUID,
  form: FormMetadataValue,
): Promise<ResultMetadataValue> =>
  putValidated(`/${api}/${metadata}/${values}/${id}`, form);

export const addMetadataValueToSource = async (
  sourceId: string,
  metadataValueIds: string[],
): Promise<ResultMetadataValue[]> =>
  postValidated(
    `/${api}/${sources}/${sourceId}/${metadata}/${values}`,
    metadataValueIds,
  );

export const addMetadataValueToCorpus = async (
  corpusId: string,
  metadataValueIds: string[],
): Promise<ResultMetadataValue[]> =>
  postValidated(
    `/${api}/${corpora}/${corpusId}/${metadata}/${values}`,
    metadataValueIds,
  );

/**
 * Media:
 */

export const getMedia = async (
  type?: SupportedMediaTypeType,
): Promise<ResultMedia[]> => getValidated(`/${api}/${media}`, { type });

export const getMediaEntry = async (id: UUID): Promise<ResultMedia> =>
  getValidated(`/${api}/${media}/${id}`);

export const createMedia = async (form: FormMedia): Promise<ResultMedia> =>
  postValidated(`/${api}/${media}`, form);

export const updateMedia = async (
  id: UUID,
  form: FormMedia,
): Promise<ResultMedia> => putValidated(`/${api}/${media}/${id}`, form);

export const deleteMedia = async (mediaId: UUID) =>
  deleteValidated(`/${api}/${media}/${mediaId}`);

export const addMediaToSource = async (
  sourceId: string,
  mediaIds: string[],
): Promise<ResultMedia[]> =>
  postValidated(`/${api}/${sources}/${sourceId}/${media}`, mediaIds);

export const addMediaToCorpus = async (
  corpusId: string,
  mediaIds: string[],
): Promise<ResultMedia[]> =>
  postValidated(`/${api}/${corpora}/${corpusId}/${media}`, mediaIds);

export const deleteMediaFromCorpus = async (
  corpusId: string,
  mediaId: string,
): Promise<void> =>
  deleteValidated(`/${api}/${corpora}/${corpusId}/${media}/${mediaId}`);

export const deleteMediaFromSource = async (
  sourceId: string,
  mediaId: string,
): Promise<void> =>
  deleteValidated(`/${api}/${sources}/${sourceId}/${media}/${mediaId}`);

export const getMediaAutocomplete = async (
  input: string,
): Promise<ResultMedia[]> =>
  postValidated(`/${api}/${media}/autocomplete`, input);

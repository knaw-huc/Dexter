import {
  FormReference,
  FormTag,
  ResultImport,
  ResultLanguage,
  ResultListLanguages,
  ResultMetadataKey,
  ResultReference,
  ResultTag,
  ResultUserResources,
  User,
  UserSettings,
  UUID,
} from '../model/DexterModel';
import { validateResponse } from './validateResponse';
import _ from 'lodash';

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

export async function getValidated(
  path: string,
  params?: Record<string, string>,
) {
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

export const postValidated = (url: string, content?: BodyToStringify) =>
  fetchValidatedWith(url, POST, content);

export const putValidated = (url: string, content?: BodyToStringify) =>
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

export async function deleteValidated(url: string): Promise<void> {
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
    `${window.location.origin}/api/assets/${cslFilename}`,
  );
  await validateResponse({ response });
  return response;
}

/**
 * Language:
 */

export const getLanguages = async (): Promise<ResultListLanguages> =>
  getValidated(`/api/languages`);

export const getLanguagesAutocomplete = async (
  input: string,
): Promise<ResultLanguage[]> =>
  postValidated(`/api/languages/autocomplete`, input);

/**
 * Tags:
 */

export const getTags = async () => getValidated(`/api/tags`);

export const createTag = async (newTag: FormTag): Promise<ResultTag> =>
  postValidated(`/api/tags`, newTag);

export const deleteTag = async (id: number): Promise<void> =>
  deleteValidated(`/api/tags/${id}`);

export const getTagsAutocomplete = async (
  input: string,
): Promise<ResultTag[]> => postValidated(`/api/tags/autocomplete`, input);

/**
 * References:
 */

export const getReferences = async (): Promise<ResultReference[]> =>
  getValidated(`/api/references`);

export const createReference = async (
  newReference: FormReference,
): Promise<ResultReference> => postValidated(`/api/references`, newReference);

export const updateReference = async (
  id: UUID,
  newReference: FormReference,
): Promise<ResultReference> =>
  putValidated(`/api/references/${id}`, newReference);

export const deleteReference = async (id: string): Promise<void> =>
  deleteValidated(`/api/references/${id}`);

export const getReferenceAutocomplete = async (
  input: string,
): Promise<ResultReference[]> =>
  postValidated(`/api/references/autocomplete`, input);

/**
 * Import:
 */

export const postImport = async (url: URL): Promise<ResultImport> =>
  postValidated(`/api/import/wereldculturen`, { url });

/**
 * User:
 */

export const login = async (): Promise<User> =>
  postValidated(`/api/user/login`);
export const updateUserSettings = async (
  userSettings: UserSettings,
): Promise<void> => putValidated(`/api/user/settings`, userSettings);

export const getMetadataKeys = async (): Promise<ResultMetadataKey[]> =>
  getValidated(`/api/metadata/keys`);
/**
 * Media:
 */

export const getUserResources = async (): Promise<ResultUserResources> => {
  return getValidated(`/api/user/resources`);
};

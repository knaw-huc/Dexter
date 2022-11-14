import {
  FormKeyword,
  ServerCorpus,
  ServerKeyword,
  ServerLanguage,
  ServerSource,
} from "../Model/DexterModel";

const headers = {
  "Content-Type": "application/json",
};

export const getCollections = async () => {
  const response = await fetch("/api/corpora", {
    method: "GET",
    headers: headers,
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }

  const data: ServerCorpus[] = await response.json();
  console.log(data);

  return data;
};

export const getCollectionById = async (id: string) => {
  const response = await fetch(`/api/corpora/${id}`, {
    method: "GET",
    headers: headers,
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }

  const data: ServerCorpus = await response.json();
  console.log(data);

  return data;
};

export const createCollection = async (newCorpus: ServerCorpus) => {
  JSON.stringify(newCorpus);
  const response = await fetch("/api/corpora", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(newCorpus),
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }

  const data: ServerCorpus = await response.json();
  console.log(data);

  return data;
};

export const updateCollection = async (
  id: string,
  updatedCorpus: ServerCorpus
) => {
  const response = await fetch(`/api/corpora/${id}`, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(updatedCorpus),
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }

  const data: ServerCorpus = await response.json();
  console.log(data);

  return data;
};

export const deleteCollection = async (id: string) => {
  const response = await fetch(`/api/corpora/${id}`, {
    method: "DELETE",
    headers: headers,
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }
};

export const getSources = async () => {
  const response = await fetch("/api/sources", {
    method: "GET",
    headers: headers,
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }

  const data: ServerSource[] = await response.json();
  console.log(data);

  return data;
};

export const getSourceById = async (id: string) => {
  console.log(id);
  const response = await fetch(`/api/sources/${id}`, {
    method: "GET",
    headers: headers,
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }

  const data: ServerSource = await response.json();
  console.log(data);

  return data;
};

export const createSource = async (newSource: ServerSource) => {
  const response = await fetch("/api/sources", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(newSource),
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }

  const data: ServerSource = await response.json();
  console.log(data);

  return data;
};

export const updateSource = async (id: string, updatedSource: ServerSource) => {
  const response = await fetch(`/api/sources/${id}`, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(updatedSource),
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }

  const data: ServerSource = await response.json();
  console.log(data);

  return data;
};

export const deleteSource = async (id: string) => {
  const response = await fetch(`/api/sources/${id}`, {
    method: "DELETE",
    headers: headers,
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }
};

export const getKeywords = async () => {
  const response = await fetch("/api/keywords", {
    method: "GET",
    headers: headers,
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }

  const data: ServerKeyword[] = await response.json();
  console.log(data);

  return data;
};

export const createKeywords = async (newKeyword: FormKeyword) => {
  const response = await fetch("/api/keywords", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(newKeyword),
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }

  const data: FormKeyword = await response.json();
  console.log(data);

  return data;
};

export const addKeywordsToCorpus = async (
  corpusId: string,
  keywordId: string[]
) => {
  const response = await fetch(`/api/corpora/${corpusId}/keywords`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(keywordId),
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }

  const data: ServerKeyword = await response.json();
  console.log(data);

  return data;
};

export const addKeywordsToSource = async (
  sourceId: string,
  keywordId: string[]
) => {
  const response = await fetch(`/api/sources/${sourceId}/keywords`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(keywordId),
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }

  const data: ServerKeyword = await response.json();
  console.log(data);

  return data;
};

export const deleteKeyword = async (id: string) => {
  const response = await fetch(`/api/keywords/${id}`, {
    method: "DELETE",
    headers: headers,
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }
};

export const getKeywordsSources = async (sourceId: string) => {
  const response = await fetch(`/api/sources/${sourceId}/keywords`, {
    method: "GET",
    headers: headers,
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }

  const data: ServerKeyword[] = await response.json();
  console.log(data);

  return data;
};

export const getKeywordsCorpora = async (corpusId: string) => {
  const response = await fetch(`/api/corpora/${corpusId}/keywords`, {
    method: "GET",
    headers: headers,
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }

  const data: ServerKeyword[] = await response.json();
  console.log(data);

  return data;
};

export const getKeywordsAutocomplete = async (input: string) => {
  const response = await fetch("/api/keywords/autocomplete", {
    method: "POST",
    headers: headers,
    body: input,
  });

  if (!response.ok) {
    console.error(response);
    return;
  }

  const data: ServerKeyword[] = await response.json();
  console.log(data);

  return data;
};

export const getLanguagesAutocomplete = async (input: string) => {
  const response = await fetch("/api/languages/autocomplete", {
    method: "POST",
    headers: headers,
    body: input,
  });

  if (!response.ok) {
    console.error(response);
    return;
  }

  const data: ServerLanguage[] = await response.json();
  console.log(data);

  return data;
};

export const addLanguagesToCorpus = async (
  corpusId: string,
  languageId: string[]
) => {
  const response = await fetch(`/api/corpora/${corpusId}/languages`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(languageId),
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }

  const data: ServerLanguage = await response.json();
  console.log(data);

  return data;
};

export const addLanguagesToSource = async (
  corpusId: string,
  languageId: string[]
) => {
  const response = await fetch(`/api/sources/${corpusId}/languages`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(languageId),
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }

  const data: ServerLanguage = await response.json();
  console.log(data);

  return data;
};

export const getLanguages = async (type: string, id: string) => {
  const response = await fetch(`/api/${type}/${id}/languages`, {
    method: "GET",
    headers: headers,
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }

  const data: ServerLanguage[] = await response.json();
  console.log(data);

  return data;
};

export const getLanguagesCorpora = (corpusId: string) =>
  getLanguages("corpora", corpusId);
export const getLanguagesSources = (sourceId: string) =>
  getLanguages("sources", sourceId);

export const deleteLanguageFromCorpus = async (
  corpusId: string,
  languageId: string
) => {
  const response = await fetch(
    `/api/corpora/${corpusId}/languages/${languageId}`,
    {
      method: "DELETE",
      headers: headers,
    }
  );

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return null;
  }

  const data: ServerLanguage[] = await response.json();

  return data;
};

export const deleteKeywordFromCorpus = async (
  corpusId: string,
  keywordId: string
) => {
  const response = await fetch(
    `/api/corpora/${corpusId}/keywords/${keywordId}`,
    {
      method: "DELETE",
      headers: headers,
    }
  );

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return null;
  }

  const data: ServerKeyword[] = await response.json();

  return data;
};

export const deleteLanguageFromSource = async (
  sourceId: string,
  languageId: string
) => {
  const response = await fetch(
    `/api/sources/${sourceId}/languages/${languageId}`,
    {
      method: "DELETE",
      headers: headers,
    }
  );

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }
};

export const deleteKeywordFromSource = async (
  sourceId: string,
  keywordId: string
) => {
  const response = await fetch(
    `/api/sources/${sourceId}/keywords/${keywordId}`,
    {
      method: "DELETE",
      headers: headers,
    }
  );
  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }
};

export const addSourcesToCorpus = async (
  corpusId: string,
  sourceIds: string
) => {
  const response = await fetch(`/api/corpora/${corpusId}/sources`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(sourceIds),
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }

  const data: ServerSource[] = await response.json();

  console.log(data);

  return data;
};

export const getSourcesInCorpus = async (corpusId: string) => {
  const response = await fetch(`/api/corpora/${corpusId}/sources`, {
    method: "GET",
    headers: headers,
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }

  const data: ServerSource[] = await response.json();

  console.log(data);

  return data;
};

export const deleteSourceFromCorpus = async (
  corpusId: string,
  sourceId: string
) => {
  const response = await fetch(`/api/corpora/${corpusId}/sources/${sourceId}`, {
    method: "DELETE",
    headers: headers,
  });

  console.log(response);

  if (!response.ok) {
    console.error(response);
    return;
  }
};
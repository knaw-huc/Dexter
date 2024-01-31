import {
    Corpus,
    FormKeyword,
    FormMetadataKey, FormMetadataValue,
    ImportResult,
    ResultMetadataKey, ResultMetadataValue,
    ServerFormCorpus,
    ServerFormSource,
    ServerKeyword,
    ServerLanguage,
    ServerResultSource,
    Source,
    UUID
} from "../model/DexterModel"
import {validateResponse} from "./validateResponse"
import {fetchValidated} from "./fetchValidated"

export const headers = {
    "Content-Type": "application/json"
}

export type ResponseErrorParams = {
    response: Response
}

export class ResponseError extends Error {
    response: Response
    constructor(params: ResponseErrorParams) {
        super()
        const {statusText, url, status} = params.response
        this.message = `${statusText}: request to ${url} failed with ${status}`
        this.name = this.constructor.name
        this.response = params.response
    }
}

export async function toReadable(
    prefixMessage: string,
    e: ResponseError
) {
    const json = await e.response.json()
    return {message: `${prefixMessage}: ${json.message}`}
}

export const getCorporaWithResources = async (): Promise<Corpus[]> => {
    return fetchValidated("/api/corpora/with-resources")
}

export const getCorpusWithResourcesById = async (id: string): Promise<Corpus> => {
    return fetchValidated(`/api/corpora/${id}/with-resources`)
}

export const createCorpus = async (
    newCorpus: ServerFormCorpus
): Promise<Corpus> => {
    const path = "/api/corpora"
    const response = await fetch(path, {
        headers,
        method: "POST",
        body: JSON.stringify(newCorpus)
    })
    validateResponse({response})
    return response.json()
}

export const updateCorpus = async (
    id: string, updatedCorpus: ServerFormCorpus
): Promise<Corpus> => {
    const path = `/api/corpora/${id}`
    const response = await fetch(path, {
        headers,
        method: "PUT",
        body: JSON.stringify(updatedCorpus)
    })
    validateResponse({response})
    return response.json()
}

export const deleteCollection = async (id: string): Promise<void> => {
    const path = `/api/corpora/${id}`
    const response = await fetch(path, {
        headers,
        method: "DELETE"
    })
    validateResponse({response})
}

export const getSourcesWithResources = async (): Promise<Source[]> => {
    return fetchValidated("/api/sources/with-resources")
}

export async function getSourceById(id: string): Promise<ServerResultSource> {
    return fetchValidated(`/api/sources/${id}`)
}

export async function getSourceWithResourcesById(id: string): Promise<Source> {
    return fetchValidated(`/api/sources/${id}/with-resources`)
}

export const createSource = async (newSource: ServerFormSource): Promise<ServerResultSource> => {
    const path = "/api/sources"
    const response = await fetch(path, {
        headers,
        method: "POST",
        body: JSON.stringify(newSource)
    })
    validateResponse({response})
    return response.json()
}

export const updateSource = async (
    id: string,
    updatedSource: ServerFormSource
): Promise<Source> => {
    const path = `/api/sources/${id}`
    const response = await fetch(path, {
        headers,
        method: "PUT",
        body: JSON.stringify(updatedSource)
    })
    validateResponse({response})
    return response.json()
}

export const deleteSource = async (id: string): Promise<void> => {
    const path = `/api/sources/${id}`
    const response = await fetch(path, {
        headers,
        method: "DELETE"
    })
    validateResponse({response})
}

export const getKeywords = async () => {
    return fetchValidated(`/api/keywords`)
};

export const createKeyword = async (
    newKeyword: FormKeyword
): Promise<ServerKeyword> => {
    const response = await fetch("/api/keywords", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(newKeyword),
    });
    validateResponse({response});
    return response.json();
};

export const addKeywordsToCorpus = async (
    corpusId: string,
    keywordId: string[]
): Promise<ServerKeyword[]> => {
    const response = await fetch(`/api/corpora/${corpusId}/keywords`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(keywordId),
    });
    validateResponse({response});
    return response.json();
};

export const addKeywordsToSource = async (
    sourceId: string,
    keywordId: string[]
): Promise<ServerKeyword[]> => {
    const response = await fetch(`/api/sources/${sourceId}/keywords`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(keywordId),
    });
    validateResponse({response});
    return response.json();
};

export const deleteKeyword = async (id: string): Promise<void> => {
    const response = await fetch(`/api/keywords/${id}`, {
        method: "DELETE",
        headers: headers,
    });
    validateResponse({response});
};

export const getKeywordsAutocomplete = async (
    input: string
): Promise<ServerKeyword[]> => {
    const response = await fetch("/api/keywords/autocomplete", {
        method: "POST",
        headers: headers,
        body: input,
    });
    validateResponse({response});
    return response.json();
};

export const getLanguagesAutocomplete = async (input: string): Promise<ServerLanguage[]>  => {
    const response = await fetch("/api/languages/autocomplete", {
        method: "POST",
        headers: headers,
        body: input,
    });
    validateResponse({response});
    return response.json();
};

export const addLanguagesToCorpus = async (
    corpusId: string,
    languageId: string[]
): Promise<ServerLanguage[]>  => {
    const response = await fetch(`/api/corpora/${corpusId}/languages`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(languageId),
    });
    validateResponse({response});
    return response.json();
};

export const deleteLanguageFromCorpus = async (
    corpusId: string,
    languageId: string
): Promise<ServerLanguage[]> => {
    const response = await fetch(
        `/api/corpora/${corpusId}/languages/${languageId}`,
        {
            method: "DELETE",
            headers: headers,
        }
    );
    validateResponse({response});
    return response.json()};

export const addLanguagesToSource = async (
    corpusId: string,
    languageId: string[]
): Promise<ServerLanguage[]> => {
    const response = await fetch(`/api/sources/${corpusId}/languages`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(languageId),
    });
    validateResponse({response});
    return response.json();
};

export const deleteLanguageFromSource = async (
    sourceId: string,
    languageId: string
): Promise<void> => {
    const response = await fetch(
        `/api/sources/${sourceId}/languages/${languageId}`,
        {
            method: "DELETE",
            headers: headers,
        }
    );
    validateResponse({response});
};

export const deleteKeywordFromCorpus = async (
    corpusId: string,
    keywordId: string
): Promise<void> => {
    const response = await fetch(
        `/api/corpora/${corpusId}/keywords/${keywordId}`,
        {
            method: "DELETE",
            headers: headers,
        }
    );
    validateResponse({response});
};

export const deleteKeywordFromSource = async (
    sourceId: string,
    keywordId: string
): Promise<void> => {
    const response = await fetch(
        `/api/sources/${sourceId}/keywords/${keywordId}`,
        {
            method: "DELETE",
            headers: headers,
        }
    );
    validateResponse({response});
};

export const addSourcesToCorpus = async (
    corpusId: string,
    sourceIds: string[]
): Promise<Source[]> => {
    const response = await fetch(`/api/corpora/${corpusId}/sources`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(sourceIds),
    });
    validateResponse({response});
    return response.json();
};

export const deleteSourceFromCorpus = async (
    corpusId: string,
    sourceId: string
): Promise<void> => {
    const response = await fetch(`/api/corpora/${corpusId}/sources/${sourceId}`, {
        method: "DELETE",
        headers: headers,
    });
    validateResponse({response});
};


export type ResultDublinCoreMetadata = Record<string, string>;

export async function postImport(url: URL): Promise<ImportResult> {
    const path = "/api/import/wereldculturen"
    const response = await fetch(path, {
        headers,
        method: "POST",
        body: JSON.stringify({url})
    })
    validateResponse({response})
    return response.json()
}

export type LoginResponse = {
    name: string
}
export async function login(): Promise<LoginResponse> {
    const path = "/api/user/login"
    const response = await fetch(path, {
        headers: {
            ...headers
        },
        method: "POST"
    })
    validateResponse({response})
    return response.json()
}

// Metadata

export const getMetadataKeys = async function(): Promise<ResultMetadataKey[]> {
    return fetchValidated(`/api/metadata/keys`)
};

export const deleteMetadataKey = async function(id: string): Promise<void> {
    const path = `/api/metadata/keys/${id}`
    const response = await fetch(path, {
        headers,
        method: "DELETE"
    })
    validateResponse({response})
};

export const deleteMetadataValue = async function(id: string): Promise<void> {
    const path = `/api/metadata/values/${id}`
    const response = await fetch(path, {
        headers,
        method: "DELETE"
    })
    validateResponse({response})
};
export const deleteMetadataValueFromSource = async (_: string, metadataValueId: string): Promise<void> => deleteMetadataValue(metadataValueId);
export const deleteMetadataValueFromCorpus = async (_: string, metadataValueId: string): Promise<void> => deleteMetadataValue(metadataValueId);


export async function createMetadataKey(
    newKeyword: FormMetadataKey
): Promise<ResultMetadataKey> {
    const response = await fetch("/api/metadata/keys", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(newKeyword),
    });
    validateResponse({response});
    return response.json();
}

export async function updateMetadataKey(
    id: UUID,
    newKeyword: FormMetadataKey
): Promise<ResultMetadataKey> {
    const response = await fetch(`/api/metadata/keys/${id}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(newKeyword),
    });
    validateResponse({response});
    return response.json();
}

export async function createMetadataValue(
    form: FormMetadataValue
): Promise<ResultMetadataValue> {
    const response = await fetch(`/api/metadata/values`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(form),
    });
    validateResponse({response});
    return response.json();
}
export async function updateMetadataValue(
    id: UUID,
    form: FormMetadataValue
): Promise<ResultMetadataValue> {
    const response = await fetch(`/api/metadata/values/${id}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(form),
    });
    validateResponse({response});
    return response.json();
}

export const addMetadataValueToSource = async (
    sourceId: string,
    metadataValueIds: string[]
): Promise<ServerLanguage[]> => {
    const response = await fetch(`/api/sources/${sourceId}/metadata/values`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(metadataValueIds),
    });
    validateResponse({response});
    return response.json();
};

export const addMetadataValueToCorpus = async (
    corpusId: string,
    metadataValueIds: string[]
): Promise<ServerLanguage[]> => {
    const response = await fetch(`/api/corpora/${corpusId}/metadata/values`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(metadataValueIds),
    });
    validateResponse({response});
    return response.json();
};


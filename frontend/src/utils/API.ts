import {
    Corpus,
    FormKeyword,
    ServerFormCorpus,
    ServerFormSource,
    ServerKeyword,
    ServerLanguage,
    ServerResultCorpus,
    ServerResultSource,
    Source
} from "../model/DexterModel"

const headers = {
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

export function validateResponse(params: ResponseErrorParams) {
    if (!params.response.ok) {
        throw new ResponseError(params)
    }
}

async function fetchValidated(path: string) {
    const response = await fetch(path, {
        headers,
        method: "GET"
    })
    validateResponse({response})
    return response.json()
}

export const getCorpora = async (): Promise<ServerResultCorpus[]> => {
    return fetchValidated("/api/corpora")
}

export const getCorporaWithResources = async (): Promise<Corpus[]> => {
    return fetchValidated("/api/corpora/with-resources")
}

export const getCorpusById = async (id: string): Promise<ServerResultCorpus> => {
    return fetchValidated(`/api/corpora/${id}`)
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

export const getSources = async (): Promise<ServerResultSource[]> => {
    return fetchValidated("/api/sources")
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

export type ImportResult = {
    isValidExternalReference: boolean;
    imported?: ResultDublinCoreMetadata
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

export const getKeywordsSources = async (
    sourceId: string
): Promise<ServerKeyword[]> => {
    const response = await fetch(`/api/sources/${sourceId}/keywords`, {
        method: "GET",
        headers: headers,
    });
    validateResponse({response});
    return response.json();
};

export const getKeywordsCorpora = async (
    corpusId: string
): Promise<ServerKeyword[]> => {
    return fetchValidated(`/api/corpora/${corpusId}/keywords`)
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

export const getLanguages = async (type: string, id: string): Promise<ServerLanguage[]> => {
    return fetchValidated(`/api/${type}/${id}/languages`)
};

export const getLanguagesCorpora = (corpusId: string) =>
    getLanguages("corpora", corpusId);
export const getLanguagesSources = (sourceId: string) =>
    getLanguages("sources", sourceId);

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

export const getSourcesInCorpus = async (corpusId: string): Promise<Source[]> => {
    return fetchValidated(`/api/corpora/${corpusId}/sources`)
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


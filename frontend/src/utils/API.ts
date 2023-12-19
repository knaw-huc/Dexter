import {ServerCorpus, Source} from "../model/DexterModel"

const headers = {
    "Content-Type": "application/json"
}

export type ResponseErrorParams = {
    response: Response
}

export class ResponseError extends Error {
    constructor(params: ResponseErrorParams) {
        super()
        const {statusText, url, status} = params.response
        this.message = `${statusText}: request to ${url} failed with ${status}`
        this.name = this.constructor.name
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

export const getCollections = async () => {
    return fetchValidated("/api/corpora")
}

export const getCollectionById = async (id: string) => {
    return fetchValidated(`/api/corpora/${id}`)
}

export const createCollection = async (newCorpus: ServerCorpus) => {
    const path = "/api/corpora"
    const response = await fetch(path, {
        headers,
        method: "POST",
        body: JSON.stringify(newCorpus)
    })
    validateResponse({response})
    return response.json()
}

export const updateCollection = async (id: string, updatedCorpus: ServerCorpus) => {
    const path = `/api/corpora/${id}`
    const response = await fetch(path, {
        headers,
        method: "PUT",
        body: JSON.stringify(updatedCorpus)
    })
    validateResponse({response})
    return response.json()
}

export const deleteCollection = async (id: string) => {
    const path = `/api/corpora/${id}`
    const response = await fetch(path, {
        headers,
        method: "DELETE"
    })
    validateResponse({response})
}

export const getSources = async () => {
    const path = "/api/sources"
    return fetchValidated(path)
}

export async function getSourceById(id: string): Promise<Source> {
    const path = `/api/sources/${id}`
    return fetchValidated(path)
}

export const createSource = async (newSource: Source) => {
    const path = "/api/sources"
    const response = await fetch(path, {
        headers,
        method: "POST",
        body: JSON.stringify(newSource)
    })
    validateResponse({response})
    return response.json()
}

export const updateSource = async (id: string, updatedSource: Source) => {
    const path = `/api/sources/${id}`
    const response = await fetch(path, {
        headers,
        method: "PUT",
        body: JSON.stringify(updatedSource)
    })
    validateResponse({response})
    return response.json()
}

export const deleteSource = async (id: string) => {
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
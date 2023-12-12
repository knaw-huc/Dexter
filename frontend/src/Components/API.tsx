import {Collections, Source} from "../Model/DexterModel"

const headers = {
    "Content-Type": "application/json"
}

export type ResponseErrorParams = {
    response: Response
}

export class ResponseError extends Error {
    constructor(params: ResponseErrorParams) {
        super()
        this.message = `${params.response.statusText}: request to ${params.response.url} failed`
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
        method: "GET",
        headers: headers
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

export const createCollection = async (newCorpus: Collections) => {
    const path = "/api/corpora"
    const response = await fetch(path, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(newCorpus)
    })
    validateResponse({response})
    return response.json()
}

export const updateCollection = async (id: string, updatedCorpus: Collections) => {
    const path = `/api/corpora/${id}`
    const response = await fetch(path, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(updatedCorpus)
    })
    validateResponse({response})
    return response.json()
}

export const deleteCollection = async (id: string) => {
    const path = `/api/corpora/${id}`
    const response = await fetch(path, {
        method: "DELETE",
        headers: headers
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
        method: "POST",
        headers: headers,
        body: JSON.stringify(newSource)
    })
    validateResponse({response})
    return response.json()
}

export const updateSource = async (id: string, updatedSource: Source) => {
    const path = `/api/sources/${id}`
    const response = await fetch(path, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(updatedSource)
    })
    validateResponse({response})
    return response.json()
}

export const deleteSource = async (id: string) => {
    const path = `/api/sources/${id}`
    const response = await fetch(path, {
        method: "DELETE",
        headers: headers
    })
    validateResponse({response})
}

export async function postImport(url: URL) {
    const path = "/api/wereldculturen/import"
    const response = await fetch(path, {
        method: "POST",
        body: JSON.stringify({url})
    })
    validateResponse({response})
    return response.json()
}
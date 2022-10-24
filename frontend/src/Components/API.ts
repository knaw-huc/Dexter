import { Collections, Sources, Keywords, Languages } from "../Model/DexterModel"

const headers = {
    "Content-Type": "application/json"
}

export const getCollections = async () => {
    const response = await fetch("/api/corpora", {
        method: "GET",
        headers: headers
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Collections[] = await response.json()
    console.log(data)

    return data
}

export const getCollectionById = async (id: string) => {
    const response = await fetch(`/api/corpora/${id}`, {
        method: "GET",
        headers: headers
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Collections = await response.json()
    console.log(data)

    return data
}

export const createCollection = async (newCorpus: Collections) => {
    JSON.stringify(newCorpus)
    const response = await fetch("/api/corpora", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(newCorpus)
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Collections = await response.json()
    console.log(data)

    return data
}

export const updateCollection = async (id: string, updatedCorpus: Collections) => {
    const response = await fetch(`/api/corpora/${id}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(updatedCorpus)
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Collections = await response.json()
    console.log(data)

    return data
}

export const deleteCollection = async (id: string) => {
    const response = await fetch(`/api/corpora/${id}`, {
        method: "DELETE",
        headers: headers
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }
}

export const getSources = async () => {
    const response = await fetch("/api/sources", {
        method: "GET",
        headers: headers
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Sources[] = await response.json()
    console.log(data)

    return data
}

export const getSourceById = async (id: string) => {
    console.log(id)
    const response = await fetch(`/api/sources/${id}`, {
        method: "GET",
        headers: headers
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Sources = await response.json()
    console.log(data)

    return data
}

export const createSource = async (newSource: Sources) => {
    const response = await fetch("/api/sources", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(newSource)
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Sources = await response.json()
    console.log(data)

    return data
}

export const updateSource = async (id: string, updatedSource: Sources) => {
    const response = await fetch(`/api/sources/${id}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(updatedSource)
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Sources = await response.json()
    console.log(data)

    return data
}

export const deleteSource = async (id: string) => {
    const response = await fetch(`/api/sources/${id}`, {
        method: "DELETE",
        headers: headers
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }
}

export const getKeywords = async () => {
    const response = await fetch("/api/keywords", {
        method: "GET",
        headers: headers
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Keywords[] = await response.json()
    console.log(data)

    return data
}

export const createKeywords = async (newKeyword: Keywords) => {
    const response = await fetch("/api/keywords", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(newKeyword)
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Keywords = await response.json()
    console.log(data)

    return data
}

export const addKeywordsToCorpus = async (corpusId: string, keywordId: string[]) => {
    const response = await fetch(`/api/corpora/${corpusId}/keywords`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(keywordId)
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Keywords = await response.json()
    console.log(data)

    return data
}

export const addKeywordsToSource = async (sourceId: string, keywordId: string[]) => {
    const response = await fetch(`/api/sources/${sourceId}/keywords`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(keywordId)
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Keywords = await response.json()
    console.log(data)

    return data
}

export const deleteKeyword = async (id: string) => {
    const response = await fetch(`/api/keywords/${id}`, {
        method: "DELETE",
        headers: headers
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }
}

export const getKeywordsSources = async (sourceId: string) => {
    const response = await fetch(`/api/sources/${sourceId}/keywords`, {
        method: "GET",
        headers: headers
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Keywords[] = await response.json()
    console.log(data)

    return data
}

export const getKeywordsCorpora = async (corpusId: string) => {
    const response = await fetch(`/api/corpora/${corpusId}/keywords`, {
        method: "GET",
        headers: headers
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Keywords[] = await response.json()
    console.log(data)

    return data
}

export const getKeywordsAutocomplete = async (input: string) => {
    const response = await fetch("/api/keywords/autocomplete", {
        method: "POST",
        headers: headers,
        body: input
    })

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Keywords[] = await response.json()
    console.log(data)

    return data
}

export const getLanguagesAutocomplete = async (input: string) => {
    const response = await fetch("/api/languages/autocomplete", {
        method: "POST",
        headers: headers,
        body: input
    })

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Languages[] = await response.json()
    console.log(data)

    return data
}

export const addLanguagesToCorpus = async (corpusId: string, languageId: string[]) => {
    const response = await fetch(`/api/corpora/${corpusId}/languages`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(languageId)
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Languages = await response.json()
    console.log(data)

    return data
}

export const addLanguagesToSource = async (corpusId: string, languageId: string[]) => {

    const response = await fetch(`/api/sources/${corpusId}/languages`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(languageId)
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Languages = await response.json()
    console.log(data)

    return data
}

export const getLanguages = async (type: string, id: string) => {
    const response = await fetch(`/api/${type}/${id}/languages`, {
        method: "GET",
        headers: headers
    })

    console.log(response)

    if (!response.ok) {
        console.error(response)
        return
    }

    const data: Languages[] = await response.json()
    console.log(data)

    return data
}

export const getLanguagesCorpora = (corpusId: string) => getLanguages("corpora", corpusId)
export const getLanguagesSources = (sourceId: string) => getLanguages("sources", sourceId)
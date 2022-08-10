import { Collections, Sources } from "../Model/DexterModel"

let sources: Sources[] = [{
    "id": 1,
    "title": "My test source",
    "description": "This is my test source",
    "creator": "Sebastiaan",
    "subject": "Morocco",
    "rights": "Open",
    "access": "Closed",
    "created": "5 August 2022",
    "spatial": "Morocco",
    "temporal": "1940",
    "language": "Arabic"
}, {
    "id": 2,
    "title": "My test source 2",
    "description": "This is my test source 2",
    "creator": "Sebastiaan",
    "subject": "Tunisia",
    "rights": "Closed",
    "access": "Closed",
    "created": "5 August 2022",
    "spatial": "Tunisia",
    "temporal": "1820",
    "language": "Arabic"
}]

const collections: Collections[] = [{
    "id": 1,
    "title": "My test collection",
    "description": "This is my test collection",
    "mainorsub": "Main collection",
    "creator": "Sebastiaan",
    "subject": "Ancient history",
    "rights": "Open",
    "access": "Closed",
    "created": "27 July 2022",
    "spatial": "Turkey",
    "temporal": "1920-1960",
    "language": "Turkish",
    "sources": [sources[0]]
}, {
    "id": 2,
    "title": "My test collection 2",
    "description": "This is my test collection 2",
    "mainorsub": "Sub collection",
    "creator": "Sebastiaan",
    "subject": "Oral history",
    "rights": "Closed",
    "access": "Closed",
    "created": "27 July 2022",
    "spatial": "Tunisia",
    "temporal": "1800-1950",
    "language": "Berber",
    "sources": [sources[1]]
}]

export const getCollections = () =>
    new Promise<Collections[]>((resolve, reject) => {
        if (!collections) {
            return setTimeout(
                () => reject(new Error("Collections not found")),
                250
            )
        }

        setTimeout(() => resolve(Object.values(collections)), 250)
    })

export const getCollectionById = (id: number) =>
    new Promise((resolve, reject) => {
        const collection = collections[id - 1]

        if (!collection) {
            return setTimeout(
                () => reject(new Error("Collection not found")),
                250
            )
        }

        setTimeout(() => resolve(collections[id - 1]), 250)
    })

export const createCollection = (data: any) =>
    new Promise((resolve) => {
        const id = Object.keys(collections).length + 1
        const newCollection = { id, ...data }
        collections.push(newCollection)
        //collections = { ...collections, [id - 1]: newCollection }

        setTimeout(() => resolve(true), 250)
        console.log(collections)
    })

export const updateCollection = (id: number, updatedCollection: any) =>
    new Promise((resolve, reject) => {
        if (!collections[id]) {
            return setTimeout(
                () => reject(new Error("Collection not found")),
                250
            )
        }

        collections[id] = { ...collections[id], ...updatedCollection }

        return setTimeout(() => resolve(true), 250)
    })

export const getSources = () =>
    new Promise<Sources[]>((resolve, reject) => {
        if (!sources) {
            return setTimeout(
                () => reject(new Error("Source not found")),
                250
            )
        }

        setTimeout(() => resolve(Object.values(sources)), 250)
    })

export const getSourceById = (id: number) =>
    new Promise((resolve, reject) => {
        const source = sources[id - 1]
        if (!source) {
            return setTimeout(
                () => reject(new Error("Source not found")),
                250
            )
        }
        setTimeout(() => resolve(sources[id - 1]), 250)
    })

export const createSource = (data: any) =>
    new Promise((resolve) => {
        const id = Object.keys(sources).length + 1
        const newSource = { id, ...data }
        sources = { ...sources, [id - 1]: newSource }
        const collectionId = parseInt(data.partCol) - 1
        collections[collectionId].sources.push(newSource)

        setTimeout(() => resolve(true), 250)
        console.log(sources)
    })

export const updateSource = (id: number, updatedSource: any) =>
    new Promise((resolve, reject) => {
        if (!sources[id]) {
            return setTimeout(
                () => reject(new Error("Source not found")),
                250
            )
        }
        
        sources[id] = { ...sources[id], ...updatedSource }

        //const collectionId = parseInt(updateSource.partCol) - 1

        return setTimeout(() => resolve(true), 250)
    })
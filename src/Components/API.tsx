import { Collections, Sources } from "../Model/DexterModel"

const sources: Sources[] = [{
    "id": 1,
    "title": "My test source",
    "description": "This is my test source",
    "creator": "Sebastiaan",
    "subject": "Morocco",
    "rights": "Open",
    "access": "Closed",
    "created": "27 July 2022",
    "spatial": "Morocco",
    "temporal": "1940",
    "language": "Arabic",
    "lastupdated": new Date(),
    "user": "Sebastiaan",
    "creation": new Date(),
    "partCol": [1]
}, {
    "id": 2,
    "title": "My test source 2",
    "description": "This is my test source 2",
    "creator": "Sebastiaan",
    "subject": "Tunisia",
    "rights": "Closed",
    "access": "Closed",
    "created": "29 July 2022",
    "spatial": "Tunisia",
    "temporal": "1820",
    "language": "Arabic",
    "lastupdated": new Date(),
    "user": "Sebastiaan",
    "creation": new Date(),
    "partCol": [2]
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
    "created": "3 August 2022",
    "spatial": "Turkey",
    "temporal": "1920-1960",
    "language": "Turkish",
    "lastupdated": new Date(),
    "user": "Sebastiaan",
    "creation": new Date(),
    "sources": [sources[0]],
    "subCollections": [2]
}, {
    "id": 2,
    "title": "My test collection 2",
    "description": "This is my test collection 2",
    "mainorsub": "Sub collection",
    "creator": "Sebastiaan",
    "subject": "Oral history",
    "rights": "Closed",
    "access": "Closed",
    "created": "1 August 2022",
    "spatial": "Tunisia",
    "temporal": "1800-1950",
    "language": "Berber",
    "lastupdated": new Date(),
    "user": "Sebastiaan",
    "creation": new Date(),
    "sources": [sources[1]],
    "subCollections": [1]
}]

export const getCollections = () =>
    new Promise<Collections[]>((resolve, reject) => {
        if (!collections) {
            return setTimeout(
                () => reject(new Error("Collections not found")),
                100
            )
        }

        setTimeout(() => resolve(Object.values(collections)), 100)
    })

export const getCollectionById = (id: number) =>
    new Promise<Collections>((resolve, reject) => {
        const collection = collections[id - 1]

        if (!collection) {
            return setTimeout(
                () => reject(new Error("Collection not found")),
                100
            )
        }

        setTimeout(() => resolve(collections[id - 1]), 100)
    })

export const createCollection = (data: Collections) =>
    new Promise<boolean>((resolve) => {
        const id = Object.keys(collections).length + 1
        const newCollection: Collections = { id, ...data }
        console.log(newCollection)
        collections.push(newCollection)
        const colId = data.subCollections[0] - 1
        collections[colId].subCollections.push(id)

        //collections = { ...collections, [id - 1]: newCollection }

        setTimeout(() => resolve(true), 100)
        console.log(collections)
    })

export const updateCollection = (id: number, updatedCollection: Collections) =>
    new Promise<boolean>((resolve, reject) => {
        if (!collections[id]) {
            return setTimeout(
                () => reject(new Error("Collection not found")),
                100
            )
        }

        collections[id] = { ...collections[id], ...updatedCollection }

        return setTimeout(() => resolve(true), 100)
    })

export const getSources = () =>
    new Promise<Sources[]>((resolve, reject) => {
        if (!sources) {
            return setTimeout(
                () => reject(new Error("Source not found")),
                100
            )
        }

        setTimeout(() => resolve(Object.values(sources)), 100)
    })

export const getSourceById = (id: number) =>
    new Promise<Sources>((resolve, reject) => {
        const source = sources[id - 1]
        if (!source) {
            return setTimeout(
                () => reject(new Error("Source not found")),
                100
            )
        }
        setTimeout(() => resolve(sources[id - 1]), 100)
    })

export const createSource = (data: Sources) =>
    new Promise<boolean>((resolve) => {
        const id = Object.keys(sources).length + 1
        const newSource = { id, ...data }
        sources.push(newSource)
        const collectionId = data.partCol[0] - 1
        collections[collectionId].sources.push(newSource)

        setTimeout(() => resolve(true), 100)
        console.log(sources)
    })

export const updateSource = (id: number, updatedSource: Sources) =>
    new Promise<boolean>((resolve, reject) => {
        if (!sources[id]) {
            return setTimeout(
                () => reject(new Error("Source not found")),
                100
            )
        }
        
        sources[id] = { ...sources[id], ...updatedSource }

        //const collectionId = parseInt(updateSource.partCol) - 1

        return setTimeout(() => resolve(true), 100)
    })
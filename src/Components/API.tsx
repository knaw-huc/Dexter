import { Collections } from "../Model/DexterModel"

let collections: Collections[] = [{
    "id": 1,
    "title": "My test collection",
    "description": "This is my test collection",
    "mainorsub": "maincollection",
    "creator": "Sebastiaan",
    "subject": "Oral history",
    "rights": "Closed",
    "access": "Closed",
    "created": "27 July 2022",
    "spatial": "Turkey",
    "temporal": "1920-1960",
    "language": "Turkish"
}, {
    "id": 2,
    "title": "My test collection 2",
    "description": "This is my test collection 2",
    "mainorsub": "subcollection",
    "creator": "Sebastiaan",
    "subject": "Oral history",
    "rights": "Closed",
    "access": "Closed",
    "created": "27 July 2022",
    "spatial": "Tunisia",
    "temporal": "1800-1950",
    "language": "Berber"
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
        collections = { ...collections, [id - 1]: newCollection }

        setTimeout(() => resolve(true), 250)
        console.log(collections)
    })

export const updateCollection = (id: number, updatedData: any) =>
    new Promise((resolve, reject) => {
        if (!collections[id]) {
            return setTimeout(
                () => reject(new Error("Collection not found")),
                250
            )
        }

        collections[id] = { ...collections[id], ...updatedData }

        return setTimeout(() => resolve(true), 250)
    })
import { v4 as uuidv4 } from "uuid"

const idOne = uuidv4()
const idTwo = uuidv4()

let collections = {
    [idOne]: {
        id: idOne,
        title: "My test collection",
        description: "This is my test collection",
        mainorsub: "maincollection",
        creator: "Sebastiaan",
        subject: "Oral history",
        rights: "Closed",
        access: "Closed",
        created: "27 July 2022",
        spatial: "Turkey",
        temporal: "1920-1960",
        language: "Turkish"
    },
    [idTwo]: {
        id: idTwo,
        title: "My test collection 2",
        description: "This is my test collection 2",
        mainorsub: "subcollection",
        creator: "Sebastiaan",
        subject: "Oral history",
        rights: "Closed",
        access: "Closed",
        created: "27 July 2022",
        spatial: "Tunisia",
        temporal: "1800-1950",
        language: "Berber"
    }
}

export const getCollections = () => 
    new Promise((resolve, reject) => {
        if (!collections) {
            return setTimeout(
                () => reject(new Error("Collections not found")),
                250
            )
        }

        setTimeout(() => resolve(Object.values(collections)), 250)
    })


export const createCollection = (data: any) => 
    new Promise((resolve) => {
        const id = uuidv4()
        const newCollection = { id, ...data }
        collections = { ...collections, [id]: newCollection }

        setTimeout(() => resolve(true), 250)
    })
export interface Collections {
    id: number,
    title: string,
    description: string,
    mainorsub: string,
    creator: string,
    subject: string,
    rights: string,
    access: string,
    created: string,
    spatial: string,
    temporal: string,
    language: string,
    sources: Sources[]
}

export interface Sources {
    id: number,
    title: string,
    description: string,
    creator: string,
    subject: string,
    rights: string,
    access: string,
    created: string,
    spatial: string,
    temporal: string,
    language: string
}

export interface IFormInputCollections {
    id: string,
    title: string,
    description: string,
    mainorsub: {
        maincollection: string,
        subcollection: string,
    },
    creator: string,
    subject: string,
    rights: string,
    access: AccessEnum,
    created: Date,
    spatial: string,
    temporal: string,
    language: string,
    lastupdated: Date,
    user: string,
    creation: Date
    sources: []
}

export interface IFormInputSources {
    id: string,
    title: string,
    description: string,
    creator: string,
    subject: string,
    rights: string,
    access: AccessEnum,
    created: Date,
    spatial: string,
    temporal: string,
    language: string,
    lastupdated: Date,
    user: string,
    creation: Date,
    partCol: {
        id: number,
        title: string
    }
}

enum AccessEnum {
    open = "open",
    restricted = "restricted",
    closed = "closed"
}
export interface Collections {
    id: number,
    title: string,
    description: string,
    mainorsub: string,
    creator: string,
    subject: string,
    rights: string,
    access: string,
    created: Date,
    spatial: string,
    temporal: string,
    language: string,
    lastupdated: Date,
    user: string,
    creation: Date,
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
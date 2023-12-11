export interface Collections {
    id: string,
    parentId: string | null,
    title: string,
    description: string,
    rights: string,
    access: string,
    location: string | null,
    earliest: string | null,
    latest: string | null,
    contributor: string | null,
    notes: string | null,
    createdBy: string,
    createdAt: string,
    updatedAt: string
}

export interface Source {
    id: string,
    externalRef: string | null,
    title: string,
    description: string,
    rights: string,
    access: string,
    location: string | null,
    earliest: string | null,
    latest: string | null,
    notes: string | null,
    createdBy: string,
    createdAt: string,
    updatedAt: string
}

export interface Keywords {
    id: number,
    val: string
}

export interface Languages {
    id: string,
    part2b: string,
    part2t: string,
    part1: string,
    scope: string,
    type: string,
    refName: string,
    comment: string
}
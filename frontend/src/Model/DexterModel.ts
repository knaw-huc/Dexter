export interface Collections {
    id: string,
    parentId: string,
    title: string,
    description: string,
    rights: string,
    access: string,
    location: string,
    earliest: string,
    latest: string,
    contributor: string,
    notes: string,
    createdBy: string,
    createdAt: string,
    updatedAt: string
}

export interface Sources {
    id: string,
    externalRef: string,
    title: string,
    description: string,
    rights: string,
    access: string,
    location: string,
    earliest: string,
    latest: string,
    notes: string,
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
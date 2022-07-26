import React from "react"
import { NewCollection } from "./NewCollection"
import { CollectionList } from "./CollectionList"

export function Collections() {
    return (
        <>
            <NewCollection />
            <CollectionList />
        </>
    )
}
import React from "react"
import { getCollectionById } from "./API"
import { useParams } from "react-router-dom"
import { Collections } from "../Model/DexterModel"

export function CollectionItemContent() {
    const [collection, setCollection] = React.useState<Collections>(null)
    const params = useParams()

    const doGetCollectionById = async (id: number) => {
        const response: any = await getCollectionById(id)
        setCollection(response)
    }

    doGetCollectionById(parseInt(params.collectionId))

    return (
        <div>
            {collection &&
                <>
                    <p>Title: {collection.title}</p>
                    <p>Description: {collection.description}</p>
                    <p>Main or sub collection: {collection.mainorsub}</p>
                    <p>Creator: {collection.creator}</p>
                    <p>Subject: {collection.subject}</p>
                    <p>Rights: {collection.rights}</p>
                    <p>Access: {collection.access}</p>
                    <p>Created: {collection.created}</p>
                    <p>Spatial: {collection.spatial}</p>
                    <p>Temporal: {collection.temporal}</p>
                    <p>Language: {collection.language}</p>
                </>
            }
        </div>
    )
}
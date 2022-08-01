import React from "react"
import { getCollections } from "./API"
import { Collections } from "../Model/DexterModel"
import { NewCollection } from "./NewCollection"
import { CollectionItem } from "./CollectionItem"

export function CollectionList() {
    const [collections, setCollections] = React.useState<Collections[]>(null)

    const doGetCollections = React.useCallback(async () => {
        try {
            const result = await getCollections()
            setCollections(result)
            console.log(result)
        } catch(error) {
            console.log(error)
        }
    }, [])

    React.useEffect(() => {
        doGetCollections()
    }, [doGetCollections])

    const refetchCollections = async () => {
        await doGetCollections()
    }

    return (
        <>
            <NewCollection refetch={refetchCollections} />
            {collections ? collections.map((collection: Collections, index: number) => (
                <CollectionItem
                    key={index}
                    collectionId={index}
                    collection={collection}
                />
            )) : "Loading" }
        </>
    )
}
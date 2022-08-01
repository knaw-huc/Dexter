import React from "react"
import { getCollections } from "./API"
import { Collections } from "../Model/DexterModel"
import { NewCollection } from "./NewCollection"

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

    return(
        <div>
            <NewCollection refetch={refetchCollections} />
            <ul>
                {collections ? collections.map((collection: any, index: React.Key) => {
                    return (
                        <li key={index}>
                            {collection.id} {collection.title}
                        </li>
                    )
                }) : "Loading..."}
            </ul>
        </div>
    )
}
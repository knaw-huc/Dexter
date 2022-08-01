import React from "react"
import { getCollections } from "./API"

export function CollectionList() {
    const [collections, setCollections] = React.useState(null)

    React.useEffect(() => {
        const doGetUsers = async () => {
            const result = await getCollections()
            setCollections(result)
            console.log(result)
        }

        doGetUsers()
    }, [])

    console.log(collections)

    if (!collections) {
        return null
    }

    return(
        <div>
            <ul>
                {collections.map((collection: any) => {
                    return (
                        <li key={collection.id}>
                            {collection.id}
                            {collection.title}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
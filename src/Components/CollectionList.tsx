import React from "react"
import { getCollections } from "./API"
import { Collections } from "../Model/DexterModel"
import { NewCollection } from "./NewCollection"
import { CollectionItem } from "./CollectionItem"
import { appContext } from "../State/context"

export function CollectionList() {
    const { state, dispatch } = React.useContext(appContext)

    const doGetCollections = React.useCallback(async () => {
        try {
            const result = await getCollections()
            dispatch({type: "SET_COLLECTIONS", collections: result})
        } catch (error) {
            console.log(error)
        }
    }, [])

    React.useEffect(() => {
        doGetCollections()
    }, [doGetCollections])

    const refetchCollections = async () => {
        await doGetCollections()
    }

    const handleSelected = (selected: Collections | undefined) => {
        console.log(selected)
        return dispatch({ type: "SET_SELECTEDCOLLECTION", selectedCollection: selected })
    }

    return (
        <>
            <NewCollection refetch={refetchCollections} />
            {state.collections ? state.collections.map((collection: Collections, index: number) => (
                <CollectionItem
                    key={index}
                    collectionId={index}
                    collection={collection}
                    selected={state.selectedCollection?.id === collection.id}
                    onSelect={handleSelected}
                />
            )) : "Loading"}
        </>
    )
}
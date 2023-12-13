import React, {useContext} from "react"
import {Collections} from "../../Model/DexterModel"
import {NewCollection} from "./NewCollection"
import {CollectionItem} from "./CollectionItem"
import {collectionsContext} from "../../State/Collections/collectionContext"
import Button from "@mui/material/Button"
import {Actions} from "../../State/actions"
import styled from "@emotion/styled"
import {getCollections} from "../API"
import {errorContext} from "../../State/Error/errorContext"

const FilterRow = styled.div`
    display: flex;
    flex-direction: row;
`

export function CollectionList() {
    const { collectionsState, collectionsDispatch } = React.useContext(collectionsContext)
    const [showForm, setShowForm] = React.useState(false)
    const {setError} = useContext(errorContext)

    const refetchCollections = () => {
        getCollections()
            .then(collections => {
                collectionsDispatch({
                    type: Actions.SET_COLLECTIONS,
                    collections: collections
                })
            }).catch(setError)
    }

    const handleSelected = (selected?: Collections) => {
        return collectionsDispatch({ type: Actions.SET_SELECTEDCOLLECTION, selectedCollection: selected })
    }

    const formShowHandler = () => {
        setShowForm(true)
    }

    const formCloseHandler = () => {
        setShowForm(false)
    }

    return (
        <>
            <FilterRow>
                <Button variant="contained" style={{ marginLeft: "10px" }} onClick={formShowHandler}>Add new corpus</Button>
            </FilterRow>
            {showForm && <NewCollection show={showForm} onClose={formCloseHandler} refetch={refetchCollections} />}
            {collectionsState.collections?.map((collection: Collections, index: number) => (
                <CollectionItem
                    key={index}
                    collectionId={index}
                    collection={collection}
                    onSelect={handleSelected}
                />
            ))}
        </>
    )
}
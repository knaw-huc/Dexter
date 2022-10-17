import React from "react"
import { Collections } from "../..//Model/DexterModel"
import { NewCollection } from "./NewCollection"
import { CollectionItem } from "./CollectionItem"
import { collectionsContext } from "../../State/Collections/collectionContext"
import Button from "@mui/material/Button"
import { ACTIONS } from "../../State/actions"
import { doGetCollections } from "../../Utils/doGetCollections"
// import { FilterBySubject } from "../FilterBySubject"
import styled from "@emotion/styled"

const FilterRow = styled.div`
    display: flex;
    flex-direction: row;
`

export function CollectionList() {
    const { collectionsState, collectionsDispatch } = React.useContext(collectionsContext)
    const [showForm, setShowForm] = React.useState(false)
    // const [filteredSubject, setFilteredSubject] = React.useState("No filter")

    // React.useEffect(() => {
    //     if (collectionsState.collections && filteredSubject != "No filter") {
    //         const filteredCollections = collectionsState.collections.filter((collection) => {
    //             return collection.subject === filteredSubject
    //         })
    //         console.log(filteredCollections)
    //         collectionsDispatch({
    //             type: ACTIONS.SET_FILTEREDCOLLECTIONS,
    //             filteredCollections: filteredCollections
    //         })
    //     } else {
    //         return
    //     }
    // }, [collectionsDispatch, collectionsState.collections, filteredSubject])

    const refetchCollections = () => {
        doGetCollections()
            .then(function (collections) {
                collectionsDispatch({
                    type: ACTIONS.SET_COLLECTIONS,
                    collections: collections
                })
            })
    }

    const handleSelected = (selected: Collections | undefined) => {
        console.log(selected)
        return collectionsDispatch({ type: ACTIONS.SET_SELECTEDCOLLECTION, selectedCollection: selected })
    }

    const formShowHandler = () => {
        setShowForm(true)
    }

    const formCloseHandler = () => {
        setShowForm(false)
    }

    // const filterChangeHandler = (selectedSubject: string) => {
    //     return setFilteredSubject(selectedSubject)
    // }

    // const filteredCollections = collectionsState.collections.filter((collection) => {
    //     return collection.subject === filteredSubject
    // })

    return (
        <>
            <FilterRow>
                {/* <FilterBySubject selected={filteredSubject} onChangeFilter={filterChangeHandler} toFilter="Collections" /> */}
                <Button variant="contained" style={{ marginLeft: "10px" }} onClick={formShowHandler}>Add new corpus</Button>
            </FilterRow>
            {showForm && <NewCollection show={showForm} onClose={formCloseHandler} refetch={refetchCollections} />}
            {collectionsState.collections && collectionsState.collections.map((collection: Collections, index: number) => (
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
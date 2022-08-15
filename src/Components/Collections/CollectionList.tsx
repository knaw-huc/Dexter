import React from "react"
import { Collections } from "../..//Model/DexterModel"
import { NewCollection } from "./NewCollection"
import { CollectionItem } from "./CollectionItem"
import { appContext } from "../../State/context"
import { Button } from "react-bootstrap"
import { ACTIONS } from "../../State/actions"
import { doGetCollections } from "../../Utils/doGetCollections"
import { FilterBySubject } from "../FilterBySubject"

export function CollectionList() {
    const { state, dispatch } = React.useContext(appContext)
    const [showForm, setShowForm] = React.useState(false)
    const [filteredSubject, setFilteredSubject] = React.useState("No filter")

    React.useEffect(() => {
        if (state.collections) {
            const filteredCollections = state.collections.filter((collection) => {
                return collection.subject === filteredSubject
            })
            console.log(filteredCollections)
            dispatch({
                type: ACTIONS.SET_FILTEREDCOLLECTIONS,
                filteredCollections: filteredCollections
            })
        } else {
            return
        }
    }, [filteredSubject])

    const refetchCollections = () => {
        doGetCollections()
            .then(function (collections) {
                dispatch({
                    type: ACTIONS.SET_COLLECTIONS,
                    collections: collections
                })
            })
    }

    const handleSelected = (selected: Collections | undefined) => {
        console.log(selected)
        return dispatch({ type: ACTIONS.SET_SELECTEDCOLLECTION, selectedCollection: selected })
    }

    const formShowHandler = () => {
        setShowForm(true)
    }

    const formCloseHandler = () => {
        setShowForm(false)
    }

    const filterChangeHandler = (selectedSubject: any) => {
        setFilteredSubject(selectedSubject)
    }

    // const filteredCollections = state.collections.filter((collection) => {
    //     return collection.subject === filteredSubject
    // })

    return (
        <>
            <FilterBySubject selected={filteredSubject} onChangeFilter={filterChangeHandler} type="Collections" />
            {showForm && <NewCollection show={showForm} onClose={formCloseHandler} refetch={refetchCollections} />}
            <Button onClick={formShowHandler}>Add new collection</Button>
            {filteredSubject != "No filter" ? state.filteredCollections && state.filteredCollections.map((collection: Collections, index: number) => (
                <CollectionItem
                    key={index}
                    collectionId={index}
                    collection={collection}
                    selected={state.selectedCollection?.id === collection.id}
                    onSelect={handleSelected}
                    refetch={refetchCollections}
                />
            )) : state.collections && state.collections.map((collection: Collections, index: number) => (
                <CollectionItem
                    key={index}
                    collectionId={index}
                    collection={collection}
                    selected={state.selectedCollection?.id === collection.id}
                    onSelect={handleSelected}
                    refetch={refetchCollections}
                />
            ))}
        </>
    )
}
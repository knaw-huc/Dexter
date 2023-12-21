import Button from "@mui/material/Button"
import React, {useContext, useEffect} from "react"
import {ServerCorpus} from "../../model/DexterModel"
import {Actions} from "../../state/actions"
import {collectionsContext} from "../../state/collections/collectionContext"
import {CollectionLink} from "./CollectionLink"
import {CollectionForm} from "./CollectionForm"
import styled from "@emotion/styled"
import {errorContext} from "../../state/error/errorContext"
import {getCollections} from "../../utils/API"

const FilterRow = styled.div`
  display: flex;
  flex-direction: row;
`

export function CollectionsPage() {
    const {collectionsState, dispatchCollections} =
        useContext(collectionsContext)
    const [showForm, setShowForm] = React.useState(false)
    const {dispatchError} = useContext(errorContext)

    const refetchCollections = () => {
        getCollections().then(function (collections) {
            dispatchCollections({
                type: Actions.SET_COLLECTIONS,
                collections: collections,
            })
        }).catch(dispatchError)
    }

    const handleSelected = (selected?: ServerCorpus) => {
        return dispatchCollections({type: Actions.SET_SELECTEDCOLLECTION, selectedCollection: selected})
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
                {/* <FilterBySubject selected={filteredSubject} onChangeFilter={filterChangeHandler} toFilter="Collections" /> */}
                <Button
                    variant="contained"
                    style={{marginLeft: "10px"}}
                    onClick={formShowHandler}
                >
                    Add new corpus
                </Button>
            </FilterRow>
            {showForm && (
                <CollectionForm
                    show={showForm}
                    onClose={formCloseHandler}
                    refetch={refetchCollections}
                />
            )}
            {collectionsState.collections && (
                <ul>
                    {collectionsState.collections.map(
                        (collection: ServerCorpus, index: number) => (
                            <CollectionLink
                                key={index}
                                collectionId={index}
                                collection={collection}
                                onSelect={handleSelected}
                            />
                        )
                    )}
                </ul>
            )}
        </>
    )
}

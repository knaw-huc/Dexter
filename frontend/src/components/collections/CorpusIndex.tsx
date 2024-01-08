import Button from "@mui/material/Button"
import React, {useContext, useEffect} from "react"
import {ServerCorpus} from "../../model/DexterModel"
import {Actions} from "../../state/actions"
import {collectionsContext} from "../../state/collections/collectionContext"
import {CorpusLink} from "./CorpusLink"
import {CorpusForm} from "./CorpusForm"
import styled from "@emotion/styled"
import {errorContext} from "../../state/error/errorContext"
import {getCollections} from "../../utils/API"
import {AddIconStyled} from "../common/AddIconStyled"
import {ButtonWithIcon} from "../common/ButtonWithIcon"

const FilterRow = styled.div`
  display: flex;
  flex-direction: row;
`

export function CorpusIndex() {
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
                <ButtonWithIcon
                    variant="contained"
                    style={{marginLeft: "10px"}}
                    onClick={formShowHandler}
                >
                    <AddIconStyled/>
                    Corpus
                </ButtonWithIcon>
            </FilterRow>
            {showForm && (
                <CorpusForm
                    show={showForm}
                    onClose={formCloseHandler}
                    refetch={refetchCollections}
                />
            )}
            {collectionsState.collections && (
                <ul>
                    {collectionsState.collections.map(
                        (collection: ServerCorpus, index: number) => (
                            <CorpusLink
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

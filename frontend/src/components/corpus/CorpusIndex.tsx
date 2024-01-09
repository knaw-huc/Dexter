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
import {Grid} from "@mui/material"

const FilterRow = styled.div`
  display: flex;
  flex-direction: row;
`

export function CorpusIndex() {
    const {collectionsState, dispatchCollections} =
        useContext(collectionsContext)
    const [showForm, setShowForm] = React.useState(false)
    const {dispatchError} = useContext(errorContext)

    return (
        <>
            <FilterRow>
                <ButtonWithIcon
                    variant="contained"
                    onClick={() => setShowForm(true)}
                >
                    <AddIconStyled/>
                    Corpus
                </ButtonWithIcon>
            </FilterRow>
            {showForm && (
                <CorpusForm
                    show={showForm}
                    onClose={() => setShowForm(false)}
                />
            )}
            {collectionsState.collections && (
                <Grid
                    container
                    spacing={2}
                    sx={{pl: 0.1, pr: 1, mt: 2, mb: 2}}
                >
                    {collectionsState.collections.map(
                        (collection: ServerCorpus, index: number) => <Grid
                            item
                            xs={4}
                            height="150px"
                            key={index}
                        >
                            <CorpusLink
                                collectionId={index}
                                collection={collection}
                            />
                        </Grid>)}
                </Grid>
            )}
        </>
    )
}

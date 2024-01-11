import React, {useContext, useEffect, useState} from "react"
import {ServerCorpus, ServerResultSource} from "../../model/DexterModel"
import {CorpusPreview} from "./CorpusPreview"
import {CorpusForm} from "./CorpusForm"
import styled from "@emotion/styled"
import {errorContext} from "../../state/error/errorContext"
import {getCorporaWithResources, getSources} from "../../utils/API"
import {AddIconStyled} from "../common/AddIconStyled"
import {ButtonWithIcon} from "../common/ButtonWithIcon"
import {Grid} from "@mui/material"

const FilterRow = styled.div`
  display: flex;
  flex-direction: row;
`

export function CorpusIndex() {
    const [showForm, setShowForm] = React.useState(false)
    const {dispatchError} = useContext(errorContext)
    const [corpora, setCorpora] = useState<ServerCorpus[]>()
    const [sourceOptions, setSourceOptions] = useState<ServerResultSource[]>()
    const [isInit, setInit] = useState(false)

    const initResources = async () => {
        const corporaWithResources = await getCorporaWithResources()
            .catch(dispatchError)
        if (!corporaWithResources) {
            dispatchError(new Error(`No corpora found`))
            return
        }
        setCorpora(corporaWithResources)
        setSourceOptions(await getSources())
    }

    useEffect(() => {
        if(!isInit) {
            setInit(true)
            initResources()
        }
    }, [isInit])

    function handleDelete(corpus: ServerCorpus) {
        setCorpora(corpora => corpora.filter(c => c.id !== corpus.id))
    }

    function handleSave(update: ServerCorpus) {
        setCorpora(corpora => [...corpora, update])
        setShowForm(false)
    }

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
                    parentOptions={corpora}
                    sourceOptions={sourceOptions}
                    onSave={handleSave}
                    onClose={() => setShowForm(false)}
                />
            )}
            {corpora && (
                <Grid
                    container
                    spacing={2}
                    sx={{pl: 0.1, pr: 1, mt: 2, mb: 2}}
                >
                    {corpora.map(
                        (corpus: ServerCorpus, index: number) => <Grid
                            item
                            xs={4}
                            height="150px"
                            key={index}
                        >
                            <CorpusPreview
                                collectionId={index}
                                collection={corpus}
                                onDelete={() => handleDelete(corpus)}
                            />
                        </Grid>)}
                </Grid>
            )}
        </>
    )
}

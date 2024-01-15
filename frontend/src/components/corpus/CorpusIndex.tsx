import React, {useContext, useEffect, useState} from "react"
import {Corpus, ServerResultSource} from "../../model/DexterModel"
import {CorpusPreview} from "./CorpusPreview"
import {CorpusForm} from "./CorpusForm"
import styled from "@emotion/styled"
import {errorContext} from "../../state/error/errorContext"
import {addCorpusResources, getCorpora, getSources} from "../../utils/API"
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
    const [corpora, setCorpora] = useState<Corpus[]>()
    const [sourceOptions, setSourceOptions] = useState<ServerResultSource[]>()
    const [isInit, setInit] = useState(false)

    const initResources = async () => {
        try {
            const corpora = await getCorpora()
            setCorpora(corpora)
            setSourceOptions(await getSources())
            const corporaComplete = await Promise.all(corpora.map(addCorpusResources));
            setCorpora(corporaComplete)
        } catch (e) {
            dispatchError(e)
        }
    }

    useEffect(() => {
        if(!isInit) {
            setInit(true)
            initResources()
        }
    }, [isInit])

    function handleDelete(corpus: Corpus) {
        setCorpora(corpora => corpora.filter(c => c.id !== corpus.id))
    }

    function handleSave(update: Corpus) {
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
                        (corpus: Corpus, index: number) => <Grid
                            item
                            xs={4}
                            height="150px"
                            key={index}
                        >
                            <CorpusPreview
                                corpus={corpus}
                                onDelete={() => handleDelete(corpus)}
                            />
                        </Grid>)}
                </Grid>
            )}
        </>
    )
}

import React, {useContext, useEffect, useState} from "react"
import {Source} from "../../model/DexterModel"
import {SourceItem} from "./SourceItem"
import styled from "@emotion/styled"
import {addCorpusResources, getCorpora, getSources, getSourcesWithResources} from "../../utils/API"
import {SourceForm} from "./SourceForm"
import {AddNewSourceButton} from "./AddNewSourceButton"
import {List} from "@mui/material"
import {errorContext} from "../../state/error/errorContext"

const FilterRow = styled.div`
  display: flex;
  flex-direction: row;
`

export function SourceIndex() {
    const [showForm, setShowForm] = React.useState(false)
    const [sources, setSources] = useState<Source[]>()
    const [isInit, setInit] = useState(false)
    const {dispatchError} = useContext(errorContext)

    useEffect(() => {
        async function initResources() {
            try {
                setSources(await getSourcesWithResources())
            } catch (e) {
                dispatchError(e)
            }
        }

        if (!isInit) {
            setInit(true)
            initResources()
        }
    }, [isInit])

    const handleDelete = (source: Source) => {
        setSources(sources => sources.filter(s => s.id !== source.id))
    }

    function handleSaveSource(newSource: Source) {
        setSources(sources => [...sources, newSource])
        setShowForm(false)
    }

    return <>
        <FilterRow>
            <AddNewSourceButton onClick={() => setShowForm(true)}/>
        </FilterRow>
        {showForm && <SourceForm
            onClose={() => setShowForm(false)}
            onSave={handleSaveSource}
        />}
        {sources && (
            <List
                sx={{mt: "1em"}}
            >
                {sources.map((source: Source, index: number) => (
                        <SourceItem
                            key={index}
                            sourceId={index}
                            source={source}
                            onDelete={() => handleDelete(source)}
                        />
                    )
                )}
            </List>)}
    </>
}

import React, {useContext, useEffect, useState} from "react"
import {Source} from "../../model/DexterModel"
import {SourceListItem} from "./SourceListItem"
import styled from "@emotion/styled"
import {getSourcesWithResources} from "../../utils/API"
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
    const [sourceToEdit, setSourceToEdit] = React.useState<Source>(null);

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

    const handleEdit = (source: Source) => {
        setSourceToEdit(source)
        setShowForm(true)
    }

    function handleSaveSource(source: Source) {
        if(sourceToEdit) {
            setSources(sources => sources.map(s => s.id === source.id ? source : s))
            setSourceToEdit(null)
        } else {
            setSources(sources => [...sources, source])
        }
        setShowForm(false)
    }

    return <>
        <FilterRow>
            <AddNewSourceButton onClick={() => setShowForm(true)}/>
        </FilterRow>
        {showForm && <SourceForm
            onClose={() => setShowForm(false)}
            onSave={handleSaveSource}
            sourceToEdit={sourceToEdit}
        />}
        {sources && (
            <List
                sx={{mt: "1em"}}
            >
                {sources.map((source: Source, index: number) => (
                        <SourceListItem
                            key={index}
                            source={source}
                            onDelete={() => handleDelete(source)}
                            onEdit={() => handleEdit(source)}
                        />
                    )
                )}
            </List>
        )}
    </>
}

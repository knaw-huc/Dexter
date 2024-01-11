import React, {useEffect, useState} from "react"
import {ServerSource} from "../../model/DexterModel"
import {SourceLi} from "./SourceLi"
import styled from "@emotion/styled"
import {getSourcesWithResources} from "../../utils/API"
import {SourceForm} from "./SourceForm"
import {AddNewSourceButton} from "./AddNewSourceButton"
import {useNavigate} from "react-router-dom"

const FilterRow = styled.div`
  display: flex;
  flex-direction: row;
`

export function SourceIndex() {
    const navigate = useNavigate()

    const [showForm, setShowForm] = React.useState(false)
    const [sources, setSources] = useState<ServerSource[]>()
    const [isInit, setInit] = useState(false)

    useEffect(() => {
        async function initResources() {
            setInit(true)
            setSources(await getSourcesWithResources())
        }

        if (!isInit) {
            initResources()
        }
    }, [isInit])

    const handleSelected = (selected: ServerSource) => {
        navigate(`/sources/${selected.id}`)
    }

    const handleDelete = (source: ServerSource) => {
        setSources(sources => sources.filter(s => s.id !== source.id))
    }

    function handleSaveSource(update: ServerSource) {
        setSources(sources =>
            sources.map(s => s.id === update.id ? update : s)
        )
    }

    return (
        <>
            <FilterRow>
                <AddNewSourceButton onClick={() => setShowForm(true)}/>
            </FilterRow>
            {showForm && <SourceForm
                onClose={() => setShowForm(false)}
                onSave={handleSaveSource}
            />}
            {sources && sources.map((source: ServerSource, index: number) => (
                <SourceLi
                    key={index}
                    sourceId={index}
                    source={source}
                    onSelect={handleSelected}
                    onDelete={() => handleDelete(source)}
                />
            ))}
        </>
    )
}

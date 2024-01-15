import React, {useEffect, useState} from "react"
import {Source} from "../../model/DexterModel"
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
    const [sources, setSources] = useState<Source[]>()
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

    const handleSelected = (selected: Source) => {
        navigate(`/sources/${selected.id}`)
    }

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
        {sources && sources.map((source: Source, index: number) => (
            <SourceLi
                key={index}
                sourceId={index}
                source={source}
                onSelect={handleSelected}
                onDelete={() => handleDelete(source)}
            />
        ))}
    </>
}

import React, {useContext} from "react"
import { Source } from "../../Model/DexterModel"
import { sourcesContext } from "../../State/Sources/sourcesContext"
import { Actions } from "../../State/actions"
import { SourceItem } from "./SourceItem"
import { SourceForm } from "./SourceForm"
import Button from "@mui/material/Button"
import styled from "@emotion/styled"
import {getSources} from "../API"
import {errorContext} from "../../State/Error/errorContext"

const FilterRow = styled.div`
    display: flex;
    flex-direction: row;
`

export function SourcesList() {
    const { sources, setSources } = React.useContext(sourcesContext)
    const [showForm, setShowForm] = React.useState(false)
    const {setError} = useContext(errorContext)

    const refetchSources = async () => {
        getSources()
            .then(sources => {
                setSources({
                    type: Actions.SET_SOURCES,
                    sources: sources
                })
            }).catch(setError)
    }

    const handleSelected = (selected: Source | undefined) => {
        return setSources({
            type: Actions.SET_SELECTEDSOURCE,
            selectedSource: selected
        })
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
                <Button variant="contained" style={{ marginLeft: "10px" }} onClick={formShowHandler}>Add new source</Button>
            </FilterRow>
            {showForm && <SourceForm show={showForm} onClose={formCloseHandler} refetch={refetchSources} />}
            {sources.sources && sources.sources.map((source: Source, index: number) => (
                <SourceItem
                    key={index}
                    sourceId={index}
                    source={source}
                    onSelect={handleSelected}
                />
            ))}
        </>
    )
}
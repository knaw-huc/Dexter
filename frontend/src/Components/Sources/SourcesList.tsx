import React from "react"
import { Source } from "../../Model/DexterModel"
import { sourcesContext } from "../../State/Sources/sourcesContext"
import { ACTIONS } from "../../State/actions"
import { SourceItem } from "./SourceItem"
import { SourceForm } from "./SourceForm"
import { doGetSources } from "../../Utils/doGetSources"
// import { FilterBySubject } from "../FilterBySubject"
import Button from "@mui/material/Button"
import styled from "@emotion/styled"

const FilterRow = styled.div`
    display: flex;
    flex-direction: row;
`

export function SourcesList() {
    const { sources, setSources } = React.useContext(sourcesContext)
    const [showForm, setShowForm] = React.useState(false)
    // const [filteredSubject, setFilteredSubject] = React.useState("No filter")

    // React.useEffect(() => {
    //     if (sourcesState.sources && filteredSubject != "No filter") {
    //         const filteredSources = sourcesState.sources.filter((source) => {
    //             return source.subject === filteredSubject
    //         })
    //         console.log(filteredSources)
    //         sourcesDispatch({
    //             type: ACTIONS.SET_FILTEREDSOURCES,
    //             filteredSources: filteredSources
    //         })
    //     } else {
    //         return
    //     }
    // }, [filteredSubject])

    const refetchSources = async () => {
        doGetSources()
            .then(function (sources) {
                setSources({
                    type: ACTIONS.SET_SOURCES,
                    sources: sources
                })
            })
    }

    const handleSelected = (selected: Source | undefined) => {
        console.log(selected)
        return setSources({
            type: ACTIONS.SET_SELECTEDSOURCE,
            selectedSource: selected
        })
    }

    const formShowHandler = () => {
        setShowForm(true)
    }

    const formCloseHandler = () => {
        setShowForm(false)
    }

    // const filterChangeHandler = (selectedSubject: string) => {
    //     setFilteredSubject(selectedSubject)
    // }

    return (
        <>
            <FilterRow>
                {/* <FilterBySubject selected={filteredSubject} onChangeFilter={filterChangeHandler} toFilter="Sources" /> */}
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